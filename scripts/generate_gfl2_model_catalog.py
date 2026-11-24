"""Build the viewer's GFL2 character index from game tables and original Books."""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import unicodedata
from zipfile import ZipFile

from gfl2_books.legacy import parse_book_dump
from gfl2_books.protobuf import first_int, first_text, language_id, load_locale, parse_table_bytes
from gfl2_live2d.asset_map import AssetMap
from gfl2_live2d.catalog import Catalog
from gfl2_live2d.unity import UnityReader


ROOT = Path(__file__).resolve().parents[1]
MODEL_LIST = ROOT / 'src/live2d/lappdefine.ts'
BOOKS = ROOT / 'public/Books'
OUTPUT = ROOT / 'src/live2d/gfl2-model-catalog.json'
OVERRIDES = ROOT / 'scripts/gfl2_character_overrides.json'


def key(value: str) -> str:
    return ''.join(char for char in unicodedata.normalize('NFKC', value).casefold()
                   if char.isalnum())


def term(value: object) -> str:
    return value.strip() if isinstance(value, str) else ''


def book_index() -> dict:
    index = {}
    for group in json.loads((BOOKS / 'parsed_books.json').read_bytes()):
        prefix = group['file']
        is_story = group.get('category') in (None, '', '메인 스토리', '이벤트', '중국판')
        # Main chapters have the numbered chapter label supplied by ChapterData.
        chapter = re.fullmatch(r'제\s*(\d+)\s*장', group['shortName'])
        if is_story and chapter and re.fullmatch(r'(?:CN_)?M\d+', prefix):
            kind = '메인 스토리'
            order = int(chapter[1])
            arc = kind if not prefix.startswith('CN_') else f'중국판 {kind}'
        elif is_story and re.fullmatch(r'(?:CN_)?(?:A|FE|PL|CL|W|WE)\d+', prefix):
            kind, order, arc = '이벤트', 0, prefix
        else:
            kind, order, arc = '', 0, prefix
        for episode in range(group['numMin'], group['numMax'] + 1):
            code = f"{prefix}{episode:0{group['numDigits']}d}"
            if (BOOKS / 'Parsed' / f'{code}.book.csv').is_file():
                index[code] = (arc, order, episode, kind, group['fullName'])
    return index


def available_books(args, index):
    assets, catalog, unity = AssetMap(args.asset_map), Catalog(args.catalog), UnityReader()
    legacy = defaultdict(list)
    for path in args.legacy_dumps.rglob('*.book.txt'):
        code = path.name.removesuffix('.book.txt').upper()
        if code in index:
            legacy[code].append(path)
    for code in sorted(index):
        candidates = {
            asset for name in (code, f'{code}.book') for asset in assets.named(name, 'TextAsset')
            if catalog.key_for_container(asset.container)
        }
        if len(candidates) == 1:
            asset = next(iter(candidates))
            try:
                value = json.loads(unity.text_bytes(asset.source, asset.path_id))
            except (ValueError, OSError, KeyError, IndexError):
                value = None
            if isinstance(value, dict) and ('pages' in value or 'importGridList' in value):
                yield code, 'current', value
                continue
        candidates = legacy.get(code, [])
        current = [path for path in candidates if catalog.key_for_container(path.parent.name)]
        choices = current or candidates
        if len(choices) == 1 or (choices and len({p.read_bytes() for p in choices}) == 1):
            yield code, 'current' if current else 'cached', parse_book_dump(choices[0])
            continue
        for path in (args.book_cache / 'extracted' / code, args.book_cache / 'nrbf-json' / f'{code}.json'):
            try:
                value = json.loads(path.read_bytes())
            except (ValueError, OSError):
                continue
            if isinstance(value, dict) and ('pages' in value or 'importGridList' in value):
                yield code, 'cached', value
                break


def observations(book, speaker_roles):
    for grid in book.get('importGridList', []):
        drawn = set()
        speakers = set()
        for row in grid.get('rows', []):
            strings = row.get('strings', [])
            if row.get('isCommentOut') or len(strings) < 2:
                continue
            if strings[0] == 'Character':
                actor = term(strings[1])
                drawn.add(actor)
                yield actor, '', 0, True
            elif strings[0] == 'Text' and len(strings) > 2 and strings[1] in speaker_roles:
                speaker, role = speaker_roles[strings[1]]
                if term(strings[2]) == role:
                    speakers.add((speaker, role))
        # A generic portrait can be used for several speaking characters.
        for speaker, role in sorted(speakers):
            if role in drawn:
                yield speaker, '', 0, True
    for page in book.get('pages', []):
        if not isinstance(page, dict):
            continue
        for command in page.get('commands') or []:
            if not isinstance(command, dict):
                continue
            name = str(command.get('$type', '')).split(',')[0].rsplit('.', 1)[-1]
            if name == 'AVG3DCommand_Character':
                yield term(command.get('characterName')), '', command.get('gunId') or 0, True
            elif name == 'AVG3DCommand_Text':
                yield term(command.get('speakerCharacter')), term(command.get('speakerName')), 0, False


def add_alias(index, value, character):
    if value and key(value):
        index[key(value)].add(character)


def rankless(code: str) -> str:
    return re.sub(r'(?:SSR|SR|(?<=_)R)$', '', code, flags=re.I).rstrip('_')


def generate(args) -> dict:
    ids = json.loads(re.search(r'ModelDir_GFL2: string\[\] = (\[.*?\]);',
                               MODEL_LIST.read_text(encoding='utf-8'), re.S)[1])
    stems = {model: model.removeprefix('CHA_').split('_')[0] for model in ids}
    stem_keys = {key(value) for value in stems.values()}
    overrides = json.loads(OVERRIDES.read_bytes())
    ko = load_locale(args.translation)
    with ZipFile(args.tables) as archive:
        def table(name):
            filename = f'{name}.bytes'
            return parse_table_bytes(archive.read(filename), source=filename)

        cn = {first_int(row, 1): first_text(row, 2) for row in table('LangPackageTableCnData')}
        speaker_roles = {}
        reviewed_roles = overrides.get('bookSpeakerRoles', {})
        if reviewed_roles:
            for row in table('AvgContentData'):
                speaker = cn.get(language_id(row, 2))
                if speaker in reviewed_roles:
                    speaker_roles[str(first_int(row, 1))] = (speaker, reviewed_roles[speaker])
        guns = table('GunData')
        roster = {first_int(row, 1): row for row in table('GunCharacterData')}
        npc_names = [(first_text(row, 5), language_id(row, 3)) for row in table('NpcData')]
        npc_names.extend((first_text(row, 4), language_id(row, 2)) for row in table('LobbyNpcData'))
        enemy_names = defaultdict(set)
        for table_name, pic_field, name_fields in (
            ('EnemyData', 22, (17, 40)),
            ('EnemyParentData', 27, (3, 9)),
        ):
            for row in table(table_name):
                # characterPic may include a combat variant such as Darture_default.
                base = key(first_text(row, pic_field).split('_')[0])
                for field in name_fields:
                    name_id = language_id(row, field)
                    if base and cn.get(name_id) and ko.get(name_id):
                        enemy_names[base].add((cn[name_id], ko[name_id]))

    localized = defaultdict(set)
    for id_, name in cn.items():
        translated = ko.get(id_, '')
        if 1 <= len(name) <= 20 and 1 <= len(translated) <= 30 and name.isprintable():
            localized[name].add(translated)

    characters, models, gun_ids = {}, {}, {}
    aliases = defaultdict(set)
    for row in guns:
        character_id = first_int(row, 11)
        record = roster.get(character_id, {})
        base = first_text(record, 3) or rankless(first_text(row, 9))
        if not character_id or not base:
            continue
        character = f'gun:{character_id}'
        gun_ids[first_int(row, 1)] = character
        name_id = language_id(record, 2) or language_id(row, 2)
        entry = characters.setdefault(character, {'kind': 'playable', 'en': base, 'ko': ko.get(name_id, ''), 'aliases': []})
        for value in (base, cn.get(name_id), rankless(first_text(row, 9)), first_text(row, 9)):
            if value and value not in entry['aliases']:
                entry['aliases'].append(value)
                add_alias(aliases, value, character)

    for base, name_id in npc_names:
        if not base or key(base) not in stem_keys:
            continue
        character = f'npc:{key(base)}'
        names = [value for value in (base, cn.get(name_id)) if value]
        characters[character] = {'kind': 'named', 'en': base, 'ko': ko.get(name_id, ''), 'aliases': names}
        for value in names:
            add_alias(aliases, value, character)

    for base, values in overrides['named'].items():
        if key(base) not in stem_keys:
            raise ValueError(f'Unknown model stem in named overrides: {base}')
        character = f'npc:{key(base)}'
        names = [base, *values['aliases']]
        translated = {name for value in values['aliases'] for name in localized.get(value, ())}
        preferred_name = values.get('ko')
        if len(translated) == 1:
            name = next(iter(translated))
        else:
            name = preferred_name if preferred_name in translated else ''
        characters[character] = {'kind': 'named', 'en': values.get('en', base), 'ko': name, 'aliases': names}
        for value in names:
            add_alias(aliases, value, character)

    # An enemy picture code can also represent generic units or multiple roles.
    # Only reviewed pairings promote a Live2D stem to a named boss character.
    for base, original_name in overrides.get('enemyNames', {}).items():
        stem = key(base)
        translated = {name for original, name in enemy_names[stem] if original == original_name}
        if stem not in stem_keys or len(translated) != 1 or aliases[stem]:
            print(f'Unresolved enemy table pairing: {base} / {original_name}')
            continue
        character = f'npc:{stem}'
        names = [base, original_name]
        characters[character] = {'kind': 'named', 'en': base, 'ko': next(iter(translated)), 'aliases': names}
        for value in names:
            add_alias(aliases, value, character)

    for base, label in overrides['shared'].items():
        stem = key(base)
        if aliases[stem]:
            continue
        character = f'shared:{stem}'
        characters[character] = {'kind': 'shared', 'ko': label[0], 'en': label[1], 'aliases': [base]}
        add_alias(aliases, base, character)

    extra_aliases = overrides['assetAliases'] | overrides.get('bookRoleAliases', {})
    for alternate_name, character_base in extra_aliases.items():
        candidates = aliases[key(character_base)]
        if len(candidates) != 1:
            print(f'Unresolved character alias: {alternate_name} -> {character_base}')
            continue
        character = next(iter(candidates))
        add_alias(aliases, alternate_name, character)
        if alternate_name not in characters[character]['aliases']:
            characters[character]['aliases'].append(alternate_name)

    for model, stem in stems.items():
        candidates = aliases[key(stem)]
        if len(candidates) == 1:
            models[model] = {'character': next(iter(candidates))}

    books = book_index()
    seen = defaultdict(set)
    evidence = defaultdict(set)
    speaker_names = defaultdict(set)
    book_sources = Counter()
    for code, source, book in available_books(args, books):
        book_sources[source] += 1
        for actor, speaker, gun_id, appears in observations(book, speaker_roles):
            actor_key = key(actor.removeprefix('CHA_'))
            if not actor_key:
                continue
            if speaker:
                speaker_names[actor_key].add(speaker)
            if appears:
                evidence[actor_key].add((code, gun_id))

    # A 3D speaking role can supply a localized NPC name when a single asset
    # stem matches the role and all observed names resolve to the same name.
    for model, stem in stems.items():
        actor_key = key(stem)
        if model in models or aliases[actor_key] or actor_key not in evidence:
            continue
        names = speaker_names[actor_key]
        matches = {name for original in names for name in localized.get(original, ())}
        if len(names) == 1 and len(matches) == 1:
            character = f'npc:{actor_key}'
            characters[character] = {'kind': 'named', 'en': stem, 'ko': next(iter(matches)),
                                     'aliases': [stem, *sorted(names)]}
            add_alias(aliases, stem, character)
    for model, stem in stems.items():
        if model not in models and len(aliases[key(stem)]) == 1:
            models[model] = {'character': next(iter(aliases[key(stem)]))}

    for actor, appearances in evidence.items():
        candidates = aliases[actor]
        if not candidates:
            # Legacy Books commonly add Rest or Mask to the Chinese role name.
            candidates = aliases[key(re.sub(r'(?:rest|mask|suit\d*)$', '', actor))]
        for code, gun_id in appearances:
            character = gun_ids.get(gun_id)
            if character in candidates or (character and not candidates):
                seen[character].add(code)
            elif len(candidates) == 1 and not character:
                seen[next(iter(candidates))].add(code)

    used = {entry['character'] for entry in models.values()}
    for character in used:
        if seen[character]:
            characters[character]['sceneCodes'] = sorted(seen[character])
        first = {}
        for code in sorted(seen[character], key=lambda code: (books[code][:3], code)):
            arc, _, _, kind, title = books[code]
            if kind:
                first.setdefault(arc, {'code': code, 'title': title, 'kind': kind})
        if first:
            characters[character]['firstSeen'] = sorted(first.values(), key=lambda item: (
                item['kind'] != '메인 스토리', books[item['code']][:3], item['code']))

    for model, entry in models.items():
        suffix = model.removeprefix(f'CHA_{stems[model]}_')
        if suffix == model:
            suffix = model
        entry['variant'] = overrides.get('modelVariants', {}).get(model) or overrides['variants'].get(
            suffix, [suffix.replace('_', ' ')] * 2,
        )

    covered = Counter(characters[entry['character']]['kind'] for entry in models.values())
    print('Models:', dict(covered), 'unclassified:', len(ids) - len(models))
    print('Story Books:', dict(book_sources), 'of', len(books), 'indexed; characters with appearances:',
          sum(bool(characters[character].get('firstSeen')) for character in used))
    return {
        'source': {'tables': args.tables.parent.name, 'translationSha256': hashlib.sha256(args.translation.read_bytes()).hexdigest(),
                   'books': dict(sorted(book_sources.items())), 'indexedBooks': len(books)},
        'characters': {character: characters[character] for character in sorted(used)},
        'models': dict(sorted(models.items())),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('tables', 'translation', 'book-cache', 'legacy-dumps', 'asset-map', 'catalog'):
        parser.add_argument(f'--{name}', required=True, type=Path)
    parser.add_argument('--output', type=Path, default=OUTPUT)
    args = parser.parse_args()
    data = generate(args)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
