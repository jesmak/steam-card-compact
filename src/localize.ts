import en from './languages/en.json';
import fi from './languages/fi.json';

const LANGUAGES: Record<string, Record<string, unknown>> = { en, fi };

/** A text in the viewer's language, falling back to English. Keys are dotted, such as `common.name`. */
export function translate(language: string | undefined, key: string): string {
  const code = (language ?? 'en').split(/[-_]/)[0].toLowerCase();
  return read(LANGUAGES[code], key) ?? read(LANGUAGES.en, key) ?? key;
}

function read(table: Record<string, unknown> | undefined, key: string): string | undefined {
  let value: unknown = table;
  for (const part of key.split('.')) {
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === 'string' ? value : undefined;
}

/** The language to use before Home Assistant has handed the card its own. */
export function browserLanguage(): string {
  return document.documentElement.lang || navigator.language || 'en';
}
