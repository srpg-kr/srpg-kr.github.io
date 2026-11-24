from __future__ import annotations

from collections import OrderedDict
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from typing import Any, Iterable


class UnityReader:
    def __init__(
        self,
        cache_size: int = 12,
        assetstudio_cli: Path | None = None,
        asset_map_path: Path | None = None,
    ):
        try:
            import UnityPy  # type: ignore
        except ImportError as error:
            raise RuntimeError("UnityPy is required: python -m pip install UnityPy") from error
        self.UnityPy = UnityPy
        self.cache_size = cache_size
        self.assetstudio_cli = assetstudio_cli
        self.asset_map_path = asset_map_path
        self._cache: OrderedDict[Path, Any] = OrderedDict()

    def environment(self, source: Path):
        source = source.resolve()
        if source in self._cache:
            self._cache.move_to_end(source)
            return self._cache[source]
        env = self.UnityPy.load(str(source))
        self._cache[source] = env
        while len(self._cache) > self.cache_size:
            self._cache.popitem(last=False)
        return env

    def object(self, source: Path, path_id: int):
        for obj in self.environment(source).objects:
            if obj.path_id == path_id:
                return obj
        raise KeyError(f"PathID {path_id} not found in {source}")

    def serialized_file(self, source: Path):
        for bundle in self.environment(source).files.values():
            for candidate in getattr(bundle, "files", {}).values():
                if hasattr(candidate, "externals"):
                    return candidate
        raise RuntimeError(f"No serialized Unity file in {source}")

    def cab_name(self, source: Path) -> str:
        value = self.serialized_file(source)
        return str(value.name).split("/")[-1].casefold()

    def external_cabs(self, source: Path) -> tuple[str, ...]:
        value = self.serialized_file(source)
        return tuple(
            external.path.split("/")[-1].casefold()
            for external in value.externals
        )

    def text_bytes(self, source: Path, path_id: int) -> bytes:
        value = self.object(source, path_id).read().m_Script
        return value.encode("utf-8") if isinstance(value, str) else bytes(value)

    def text_json(self, source: Path, path_id: int) -> dict[str, Any]:
        import json

        return json.loads(self.text_bytes(source, path_id).decode("utf-8-sig"))

    def moc_bytes(self, source: Path, model_name: str) -> bytes:
        candidates: list[tuple[bool, bytes]] = []
        for obj in self.environment(source).objects:
            if obj.type.name != "MonoBehaviour":
                continue
            try:
                tree = obj.read_typetree()
            except Exception:
                continue
            if "_bytes" not in tree:
                continue
            value = tree["_bytes"]
            data = (
                bytes((int(item) & 0xFF) for item in value)
                if not isinstance(value, bytes)
                else value
            )
            exact = str(tree.get("m_Name", "")).casefold() == model_name.casefold()
            candidates.append((exact, data))
        exact = [data for is_exact, data in candidates if is_exact]
        if len(exact) == 1:
            return exact[0]
        if len(candidates) == 1:
            return candidates[0][1]
        raise RuntimeError(f"Could not uniquely locate moc bytes for {model_name} in {source}")

    def save_texture(
        self,
        source: Path,
        path_id: int,
        destination: Path,
        *,
        name: str,
        container: str,
    ) -> None:
        destination.parent.mkdir(parents=True, exist_ok=True)
        try:
            obj = self.object(source, path_id)
            if obj.type.name != "Texture2D":
                raise RuntimeError(f"{source}:{path_id} is {obj.type.name}, not Texture2D")
            obj.read().image.save(destination, format="PNG")
            return
        except (KeyError, IndexError):
            # Some VFS entries are raw serialized/resource files rather than
            # UnityFS bundles. The modified AssetStudio loader understands
            # them, while UnityPy intentionally does not.
            self._save_texture_with_assetstudio(destination, name, container)

    def _save_texture_with_assetstudio(
        self, destination: Path, name: str, container: str
    ) -> None:
        if self.assetstudio_cli is None or self.asset_map_path is None:
            raise RuntimeError("AssetStudio paths are required to export this raw Texture2D")
        with tempfile.TemporaryDirectory(prefix="gfl2-texture-") as directory:
            output = Path(directory)
            command = [
                str(self.assetstudio_cli),
                str(self.asset_map_path.parent),
                str(output),
                "--game",
                "GirlsFrontline",
                "--key_index",
                "23",
                "--map_op",
                "5",  # AssetMap | Load
                "--map_type",
                "JSON",
                "--map_name",
                str(self.asset_map_path),
                "--types",
                "Texture2D",
                "--names",
                f"^{re.escape(name)}$",
                "--containers",
                f"^{re.escape(container)}$",
                "--group_assets",
                "None",
                "--export_type",
                "Convert",
                "--silent",
            ]
            subprocess.run(command, cwd=self.assetstudio_cli.parent, check=True)
            images = list(output.rglob("*.png"))
            if len(images) != 1:
                raise RuntimeError(
                    f"AssetStudio exported {len(images)} PNGs for {name} ({container})"
                )
            shutil.copy2(images[0], destination)

    def iter_typetrees(self, source: Path, object_type: str = "MonoBehaviour") -> Iterable[dict]:
        for obj in self.environment(source).objects:
            if obj.type.name != object_type:
                continue
            try:
                yield obj.read_typetree()
            except Exception:
                continue
