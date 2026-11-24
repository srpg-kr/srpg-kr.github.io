from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

from gfl2_live2d.catalog import Catalog


HIDDEN_BUNDLE_LIMIT = 512 * 1024
MAPPING_ASSET_PATH = "Assets/Utage/BuildResources/AdvBookAssetPathMappingSO.asset"


@dataclass(frozen=True)
class LegacyBook:
    candidate: str
    asset_name: str
    container: str
    original_path: str


def hidden_bundles(bundle_store: Path) -> list[Path]:
    return sorted(
        (
            path
            for path in bundle_store.iterdir()
            if path.is_file() and path.stat().st_size < HIDDEN_BUNDLE_LIMIT
        ),
        key=lambda path: path.name.casefold(),
    )


def hidden_bundle_fingerprint(sources: list[Path]) -> str:
    digest = hashlib.sha256()
    for source in sources:
        stat = source.stat()
        digest.update(
            f"{source.name.casefold()}:{stat.st_size}:{stat.st_mtime_ns}\n".encode()
        )
    return digest.hexdigest()


def ensure_legacy_dump_cache(
    assetstudio_cli: Path,
    dummy_dlls: Path,
    bundle_store: Path,
    cache_root: Path,
) -> Path:
    """Export and cache all legacy Utage Books from the hidden VFS.

    AssetStudio's AssetMap operation cannot index these typed MonoBehaviours.
    Dump export can, and grouping by container preserves the catalog GUID that
    disambiguates stale or duplicate names. One focused scan exports the path
    mapping and all ``*.book`` objects; later runs reuse it until the hidden
    bundle fingerprint changes.
    """

    cache_dir = cache_root / "_legacy-book-dumps"
    dump_root = cache_dir / "dumps"
    state_path = cache_dir / "state.json"
    sources = hidden_bundles(bundle_store)
    fingerprint = hidden_bundle_fingerprint(sources)
    if dump_root.is_dir() and state_path.is_file():
        try:
            state = json.loads(state_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            state = {}
        if state.get("fingerprint") == fingerprint:
            print(f"Reusing typed legacy Book dumps: {dump_root}")
            return dump_root

    cache_dir.mkdir(parents=True, exist_ok=True)
    stage = cache_dir / "stage"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir()
    try:
        worker_count = min(4, max(1, len(sources)))
        stage_dirs = [stage / str(index) for index in range(worker_count)]
        for directory in stage_dirs:
            directory.mkdir()
        for index, source in enumerate(sources):
            destination = stage_dirs[index % worker_count] / source.name
            try:
                os.link(source, destination)
            except OSError:
                shutil.copy2(source, destination)

        if dump_root.exists():
            shutil.rmtree(dump_root)
        dump_root.mkdir()
        print(
            f"Extracting typed legacy Books from {len(sources)} hidden bundles "
            f"({sum(path.stat().st_size for path in sources) / 1024 / 1024:.1f} MiB)"
        )
        def export_partition(index: int) -> int:
            partition_output = dump_root / str(index)
            partition_output.mkdir()
            log_path = cache_dir / f"assetstudio-books-{index}.log"
            command = [
                str(assetstudio_cli),
                str(stage_dirs[index]),
                str(partition_output),
                "--game",
                "GirlsFrontline",
                "--key_index",
                "23",
                "--types",
                "MonoBehaviour",
                "--names",
                r"^(?:AdvBookAssetPathMappingSO|.*\.book)$",
                "--group_assets",
                "ByContainer",
                "--export_type",
                "Dump",
                "--dummy_dlls",
                str(dummy_dlls),
                "--silent",
            ]
            with log_path.open("w", encoding="utf-8", errors="replace") as log:
                return subprocess.run(
                    command, stdout=log, stderr=subprocess.STDOUT
                ).returncode

        with ThreadPoolExecutor(max_workers=worker_count) as executor:
            return_codes = list(executor.map(export_partition, range(worker_count)))
        exported = list(dump_root.rglob("*.book.txt"))
        mapping = list(dump_root.rglob("AdvBookAssetPathMappingSO.txt"))
        if any(return_codes) or not exported or not mapping:
            raise RuntimeError(
                f"AssetStudio legacy Book export failed; see {cache_dir / 'assetstudio-books-*.log'}"
            )
        state_path.write_text(
            json.dumps(
                {
                    "fingerprint": fingerprint,
                    "bundles": len(sources),
                    "books": len(exported),
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        return dump_root
    finally:
        if stage.exists():
            shutil.rmtree(stage)


def find_path_mapping_dump(
    dump_root: Path,
    catalog: Catalog,
) -> Path:
    container = catalog.container_for_path(MAPPING_ASSET_PATH)
    if not container:
        raise RuntimeError(
            f"current catalog has no legacy Book path mapping: {MAPPING_ASSET_PATH}"
        )
    result = _find_container_file(
        dump_root, container, "AdvBookAssetPathMappingSO.txt"
    )
    if result is None:
        raise RuntimeError(
            "typed legacy Book cache has no AdvBookAssetPathMappingSO "
            f"for catalog container {container}"
        )
    return result


def parse_path_mapping_dump(path: Path) -> dict[str, str]:
    sections: dict[str, list[str]] = {"paths": [], "keys": [], "values": []}
    section: str | None = None
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        value = line.strip()
        if value == "vector Path":
            section = "paths"
            continue
        if value == "vector keys":
            section = "keys"
            continue
        if value == "vector values":
            section = "values"
            continue
        parsed = _dump_string(value)
        if parsed is not None and section is not None:
            sections[section].append(parsed)

    paths, keys, values = (sections[name] for name in ("paths", "keys", "values"))
    if not paths or len(keys) != len(values):
        raise RuntimeError(
            f"invalid AdvBookAssetPathMappingSO dump: {len(paths)} paths, "
            f"{len(keys)} keys, {len(values)} values"
        )
    result: dict[str, str] = {}
    for key, raw_index in zip(keys, values):
        try:
            root = paths[int(raw_index)]
        except (ValueError, IndexError):
            continue
        result[key.casefold()] = (
            f"Assets/Utage/BuildResources/{root}/{key}.book.asset"
        )
    return result


def resolve_legacy_book(
    candidates: list[str],
    path_mapping: dict[str, str],
    catalog: Catalog,
    dump_root: Path,
) -> LegacyBook | None:
    for candidate in candidates:
        original_path = path_mapping.get(candidate.casefold())
        if not original_path:
            continue
        container = catalog.container_for_path(original_path)
        if not container:
            continue
        asset_name = f"{candidate}.book"
        if _find_container_file(dump_root, container, f"{asset_name}.txt"):
            return LegacyBook(
                candidate=candidate,
                asset_name=asset_name,
                container=container.casefold(),
                original_path=original_path,
            )
    return None


def parse_book_dump(path: Path) -> dict:
    grids: list[dict[str, list[dict[str, object]]]] = []
    rows: list[dict[str, object]] = []
    current: dict[str, object] | None = None
    collecting_strings = False
    name = ""
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        value = line.strip()
        if value.startswith('string m_Name = "'):
            name = _dump_string(value.replace("string m_Name", "string data", 1)) or ""
            continue
        row_match = re.fullmatch(r"int rowIndex = (-?\d+)", value)
        if row_match:
            if current is not None:
                rows.append(current)
            row_index = int(row_match.group(1))
            if row_index == 0 and rows:
                grids.append({"rows": rows})
                rows = []
            current = {"rowIndex": row_index, "strings": []}
            collecting_strings = False
            continue
        if value == "vector strings":
            collecting_strings = True
            continue
        if current is not None and value == "UInt8 isCommentOut = 1":
            current["isCommentOut"] = True
        parsed = _dump_string(value)
        if parsed is not None and current is not None and collecting_strings:
            strings = current["strings"]
            assert isinstance(strings, list)
            strings.append(parsed)
    if current is not None:
        rows.append(current)
    if rows:
        grids.append({"rows": rows})
    return {"Name": name, "importGridList": grids}


def find_exported_dump(
    output_dir: Path,
    asset: LegacyBook,
) -> Path | None:
    return _find_container_file(
        output_dir, asset.container, f"{asset.asset_name}.txt"
    )


def _find_container_file(
    root: Path,
    container: str,
    name: str,
) -> Path | None:
    direct = root / container.casefold() / name
    if direct.is_file():
        return direct
    for partition in root.iterdir() if root.is_dir() else ():
        candidate = partition / container.casefold() / name
        if candidate.is_file():
            return candidate
    return None


def _dump_string(value: str) -> str | None:
    match = re.fullmatch(r'string data = "(.*)"', value)
    if not match:
        return None
    raw = match.group(1)
    try:
        return json.loads(f'"{raw}"')
    except json.JSONDecodeError:
        return raw.replace(r'\"', '"').replace("\\\\", "\\")
