import { useMemo, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import generatedCatalog from '../live2d/gfl2-model-catalog.json';
import { getModelDisplayName, type ModelDefinition } from '../live2d/lappdefine';

const categories = {
  playable: ['실장 캐릭터', 'Playable characters'],
  named: ['네임드 NPC', 'Named NPCs'],
  shared: ['공용 NPC', 'Shared NPCs'],
  unknown: ['미분류', 'Unclassified'],
};

type Category = keyof typeof categories;
type Appearance = { code: string; title: string; kind: string };
type Character = {
  kind: Category;
  ko: string;
  en: string;
  aliases: string[];
  sceneCodes?: string[];
  firstSeen?: Appearance[];
};
type Version = { model: ModelDefinition; variant?: string };
type CharacterGroup = { id: string; title: string; entries: Version[] };
type Props = { models: ModelDefinition[]; locale: string; onSelect: (id: string) => void };

const catalog = generatedCatalog as {
  models: Partial<Record<string, { character: string; variant: string[] }>>;
  characters: Partial<Record<string, Character>>;
};

function searchable(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/[\p{Cf}]/gu, '');
}

function unclassifiedModelStem(modelId: string) {
  return /^CHA_([^_]+)_.+$/i.exec(modelId)?.[1];
}

export default function Gfl2ModelPicker({ models, locale, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Partial<Record<Category, boolean>>>({ playable: true });
  const [collapsedResults, setCollapsedResults] = useState<Partial<Record<Category, boolean>>>({});
  const language = /^(ko|kr)(-|$)/i.test(locale) ? 0 : 1;
  const groups = useMemo(() => {
    const terms = searchable(query).trim().split(/\s+/).filter(Boolean);
    const grouped: Record<Category, Map<string, CharacterGroup>> = {
      playable: new Map(), named: new Map(), shared: new Map(), unknown: new Map(),
    };
    const unclassifiedCounts = new Map<string, number>();
    for (const model of models) {
      if (catalog.models[model.id]) continue;
      const stem = unclassifiedModelStem(model.id)?.toLowerCase();
      if (stem) unclassifiedCounts.set(stem, (unclassifiedCounts.get(stem) ?? 0) + 1);
    }
    const collator = new Intl.Collator(language === 0 ? 'ko' : 'en', { numeric: true });
    for (const model of models) {
      const entry = catalog.models[model.id];
      const character = entry && catalog.characters[entry.character];
      const category = character?.kind || 'unknown';
      const stem = entry ? undefined : unclassifiedModelStem(model.id);
      const stemKey = stem?.toLowerCase() ?? '';
      const groupByStem = (unclassifiedCounts.get(stemKey) ?? 0) > 1;
      const title = (language === 0 ? character?.ko : character?.en)
        || character?.ko || character?.en || (groupByStem ? stem : undefined)
        || getModelDisplayName(model, locale);
      const override = model.displayNames && getModelDisplayName(model, locale);
      const variant = override || entry?.variant?.[language] || (groupByStem ? model.id : undefined);
      const appearances = character?.firstSeen || [];
      const searchText = searchable([
        model.id, model.id.replaceAll('_', ' '), title, character?.ko, character?.en,
        ...(character?.aliases || []), ...Object.values(model.displayNames || {}),
        ...(entry?.variant || []), ...categories[category],
        ...(character?.sceneCodes || []), ...appearances.flatMap(({ title: story, kind }) => [story, kind]),
      ].filter(Boolean).join(' '));
      if (!terms.every((term) => searchText.includes(term))) continue;
      const id = entry?.character || (groupByStem ? `stem:${stemKey}` : model.id);
      const group = grouped[category];
      const existing = group.get(id);
      if (existing) existing.entries.push({ model, variant });
      else group.set(id, { id, title, entries: [{ model, variant }] });
    }
    return (Object.keys(categories) as Category[]).map((category) => ({
      category,
      characters: [...grouped[category].values()].sort((a, b) => collator.compare(a.title, b.title)),
    })).filter(({ characters }) => characters.length);
  }, [language, locale, models, query]);

  const hasQuery = query.trim().length > 0;
  const searchLabel = language === 0 ? '캐릭터·시나리오·에셋 ID 검색' : 'Search name, story, or asset ID';

  const modelButton = (model: ModelDefinition, label: string) => (
    <button key={model.id} type="button" className="l2d-model-option" title={model.id}
      onClick={() => onSelect(model.id)}>
      {label}
    </button>
  );

  return (
    <div className="gfl2-model-picker">
      <input type="search" value={query} onChange={(event) => {
        setQuery(event.target.value);
        setCollapsedResults({});
      }} aria-label={searchLabel} placeholder={searchLabel} />
      {groups.length === 0 && (
        <p role="status">{language === 0 ? '검색 결과가 없어.' : 'No matching models.'}</p>
      )}
      {groups.map(({ category, characters }) => {
        const open = hasQuery ? !collapsedResults[category] : Boolean(expanded[category]);
        const toggle = hasQuery ? setCollapsedResults : setExpanded;
        return (
          <section key={category} className="l2d-model-group">
            <button type="button" className="l2d-group-toggle" aria-expanded={open}
              onClick={() => toggle((state) => ({ ...state, [category]: !state[category] }))}>
              <FiChevronRight aria-hidden="true" />
              <span>{categories[category][language]}</span>
              <span className="l2d-count">{characters.length}</span>
            </button>
            {open && (
              <div className="l2d-model-list">
                {characters.map(({ id, title, entries }) => (
                  <details className="gfl2-character" key={`${id}-${hasQuery ? 'search' : 'browse'}`}
                    open={hasQuery || undefined}>
                    <summary>
                      <FiChevronRight aria-hidden="true" /> <span>{title}</span>
                      <span className="l2d-count">{entries.length}</span>
                    </summary>
                    <div className="l2d-model-variants">
                      {entries.map(({ model, variant }) => modelButton(model, variant ||
                        (entries.length === 1 ? (language === 0 ? '모델 열기' : 'Open model') : model.id)))}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
