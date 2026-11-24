from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
import json
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class Asset:
    name: str
    container: str
    source: Path
    path_id: int
    type: str


class AssetMap:
    def __init__(self, path: Path):
        self.path = path
        with path.open("r", encoding="utf-8-sig") as stream:
            raw = json.load(stream)
        if isinstance(raw, dict):
            raw = raw.get("Assets", raw.get("assets", []))
        self.assets = [
            Asset(
                name=item.get("Name", ""),
                container=item.get("Container", "").lower(),
                source=Path(item["Source"]),
                path_id=int(item.get("PathID", 0)),
                type=item.get("Type", ""),
            )
            for item in raw
        ]
        self.by_name: dict[str, list[Asset]] = defaultdict(list)
        self.by_container: dict[str, list[Asset]] = defaultdict(list)
        self.by_source: dict[Path, list[Asset]] = defaultdict(list)
        for asset in self.assets:
            self.by_name[asset.name.casefold()].append(asset)
            if asset.container:
                self.by_container[asset.container].append(asset)
            self.by_source[asset.source].append(asset)

    def named(self, name: str, asset_type: str | None = None) -> list[Asset]:
        values = self.by_name.get(name.casefold(), [])
        return [value for value in values if asset_type is None or value.type == asset_type]

    def contained(self, container: str, asset_type: str | None = None) -> list[Asset]:
        values = self.by_container.get(container.lower(), [])
        return [value for value in values if asset_type is None or value.type == asset_type]

    def models(self) -> Iterable[Asset]:
        for asset in self.assets:
            if asset.type == "TextAsset" and asset.name.casefold().endswith(".model3"):
                yield asset

    def unique_sources(self) -> list[Path]:
        return list(self.by_source)
