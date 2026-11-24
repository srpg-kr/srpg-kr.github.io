from __future__ import annotations

from pathlib import Path
from typing import TypeAlias


WireValue: TypeAlias = int | bytes
Fields: TypeAlias = dict[int, list[WireValue]]


def _read_varint(data: bytes, offset: int) -> tuple[int, int]:
    value = 0
    shift = 0
    while offset < len(data):
        byte = data[offset]
        offset += 1
        value |= (byte & 0x7F) << shift
        if byte < 0x80:
            return value, offset
        shift += 7
        if shift > 70:
            break
    raise ValueError("invalid protobuf varint")


def parse_message(data: bytes) -> Fields:
    result: Fields = {}
    offset = 0
    while offset < len(data):
        tag, offset = _read_varint(data, offset)
        number = tag >> 3
        wire_type = tag & 7
        if not number:
            raise ValueError("invalid protobuf field number 0")
        if wire_type == 0:
            value, offset = _read_varint(data, offset)
        elif wire_type == 1:
            value = data[offset : offset + 8]
            offset += 8
        elif wire_type == 2:
            length, offset = _read_varint(data, offset)
            value = data[offset : offset + length]
            offset += length
        elif wire_type == 5:
            value = data[offset : offset + 4]
            offset += 4
        else:
            raise ValueError(f"unsupported protobuf wire type {wire_type}")
        if offset > len(data):
            raise ValueError("truncated protobuf field")
        result.setdefault(number, []).append(value)
    return result


def parse_table(path: Path) -> list[Fields]:
    return parse_table_bytes(path.read_bytes(), source=str(path))


def load_locale(path: Path) -> dict[int, str]:
    result: dict[int, str] = {}
    for record in parse_table(path):
        identifier = first_int(record, 1)
        if identifier:
            result[identifier] = first_text(record, 2)
    return result


def parse_table_bytes(data: bytes, *, source: str) -> list[Fields]:
    if len(data) < 4:
        raise ValueError(f"table is too short: {source}")
    header_length = int.from_bytes(data[:4], "little")
    body_offset = 4 + header_length
    if body_offset > len(data):
        raise ValueError(f"invalid table header length in {source}")
    table = parse_message(data[body_offset:])
    records: list[Fields] = []
    for value in table.get(1, []):
        if isinstance(value, bytes):
            records.append(parse_message(value))
    return records


def first_int(fields: Fields, number: int, default: int = 0) -> int:
    values = fields.get(number)
    if not values or not isinstance(values[0], int):
        return default
    return values[0]


def first_bytes(fields: Fields, number: int) -> bytes | None:
    values = fields.get(number)
    if not values or not isinstance(values[0], bytes):
        return None
    return values[0]


def first_text(fields: Fields, number: int, default: str = "") -> str:
    value = first_bytes(fields, number)
    if value is None:
        return default
    try:
        return value.decode("utf-8")
    except UnicodeDecodeError:
        return default


def language_id(fields: Fields, number: int) -> int:
    value = first_bytes(fields, number)
    if value is None:
        return 0
    try:
        return first_int(parse_message(value), 1)
    except ValueError:
        return 0


def nested_int(fields: Fields, number: int, nested_number: int = 1) -> int:
    value = first_bytes(fields, number)
    if value is None:
        return 0
    try:
        return first_int(parse_message(value), nested_number)
    except ValueError:
        return 0
