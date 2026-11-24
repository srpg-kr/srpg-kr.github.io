from __future__ import annotations

import base64
import hashlib
import json
from pathlib import Path
import struct


def runtime_key(asset_path: str) -> str:
    """Reproduce ResourceManager.GetMappedAssetPath from the Mono beta."""
    digest = hashlib.md5(asset_path.encode("utf-16le")).digest()
    return "-".join(f"{byte:02X}" for byte in digest)


class Catalog:
    """The useful part of Unity Addressables ContentCatalogData.

    GFL2 replaces original asset paths with uppercase, hyphenated MD5 hashes.
    The hash is a catalog key and the internal ID is the same container GUID
    emitted by the modified AssetStudio build.
    """

    def __init__(self, path: Path):
        self.path = path
        with path.open("r", encoding="utf-8-sig") as stream:
            data = json.load(stream)
        keys = self._read_bucket_keys(
            base64.b64decode(data["m_KeyDataString"]),
            base64.b64decode(data["m_BucketDataString"]),
        )
        entry_data = base64.b64decode(data["m_EntryDataString"])
        internal_ids = data["m_InternalIds"]
        count = struct.unpack_from("<i", entry_data, 0)[0]
        self.key_to_container: dict[str, str] = {}
        self.container_to_key: dict[str, str] = {}
        for index in range(count):
            fields = struct.unpack_from("<7i", entry_data, 4 + index * 28)
            internal_index, primary_key_index = fields[0], fields[5]
            if not (0 <= internal_index < len(internal_ids)):
                continue
            if not (0 <= primary_key_index < len(keys)):
                continue
            key = keys[primary_key_index]
            container = internal_ids[internal_index]
            if not isinstance(key, str) or not _is_runtime_key(key):
                continue
            self.key_to_container.setdefault(key.upper(), container.lower())
            self.container_to_key.setdefault(container.lower(), key.upper())

    @staticmethod
    def _read_bucket_keys(key_data: bytes, bucket_data: bytes) -> list[object]:
        count = struct.unpack_from("<i", bucket_data, 0)[0]
        keys: list[object] = []
        position = 4
        for _ in range(count):
            offset, entry_count = struct.unpack_from("<2i", bucket_data, position)
            position += 8 + entry_count * 4
            keys.append(_decode_key(key_data, offset))
        return keys

    def container_for_path(self, asset_path: str) -> str | None:
        return self.key_to_container.get(runtime_key(asset_path))

    def key_for_container(self, container: str) -> str | None:
        return self.container_to_key.get(container.lower())

    def path_matches_container(self, asset_path: str, container: str) -> bool:
        return runtime_key(asset_path) == self.key_for_container(container)


def _decode_key(data: bytes, offset: int) -> object:
    kind = data[offset]
    position = offset + 1
    if kind in (0, 1):
        length = struct.unpack_from("<i", data, position)[0]
        position += 4
        encoding = "ascii" if kind == 0 else "utf-16le"
        return data[position : position + length].decode(encoding)
    if kind == 2:
        return struct.unpack_from("<H", data, position)[0]
    if kind == 3:
        return struct.unpack_from("<I", data, position)[0]
    if kind == 4:
        return struct.unpack_from("<i", data, position)[0]
    if kind in (5, 6):
        length = data[position]
        position += 1
        value = data[position : position + length]
        return value.decode("ascii", "replace") if kind == 5 else value.hex()
    return None


def _is_runtime_key(value: str) -> bool:
    if len(value) != 47:
        return False
    chunks = value.split("-")
    return len(chunks) == 16 and all(
        len(chunk) == 2 and all(char in "0123456789ABCDEFabcdef" for char in chunk)
        for chunk in chunks
    )
