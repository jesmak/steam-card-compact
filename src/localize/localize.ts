/// <reference types="vite/client" />

/**
 * Every JSON file in languages/ is a language, named by its file: `sv.json` is Swedish. Adding a
 * language is adding its file; nothing here changes. The build and the tests both fill this in.
 */
const FILES = import.meta.glob<Record<string, unknown>>("./languages/*.json", {
    eager: true,
    import: "default",
});

const LANGUAGES: Record<string, Record<string, unknown>> = Object.fromEntries(
    Object.entries(FILES).map(([path, table]) => [path.replace(/^.*\/|\.json$/g, "").toLowerCase(), table]),
);

/** The languages the card has, by their code. */
export const LANGUAGE_CODES = Object.keys(LANGUAGES).sort();

/**
 * A text in the viewer's language, falling back to English. Keys are dotted, such as `common.name`.
 * `pt-BR` reads `pt-br.json` first, then `pt.json`, and English last.
 */
export function translate(language: string | undefined, key: string): string {
    for (const code of languageCodes(language)) {
        const text = read(LANGUAGES[code], key);
        if (text !== undefined) {
            return text;
        }
    }
    return read(LANGUAGES.en, key) ?? key;
}

/** The codes to try for a language tag, the most specific first: `pt-br`, then `pt`. */
function languageCodes(language: string | undefined): string[] {
    const tag = (language ?? "en").trim().toLowerCase().replace(/_/g, "-");
    const base = tag.split("-")[0];
    return tag === base ? [base] : [tag, base];
}

function read(table: Record<string, unknown> | undefined, key: string): string | undefined {
    let value: unknown = table;
    for (const part of key.split(".")) {
        if (value === null || typeof value !== "object") {
            return undefined;
        }
        value = (value as Record<string, unknown>)[part];
    }
    return typeof value === "string" ? value : undefined;
}

/** The language to use before Home Assistant has handed the card its own. */
export function browserLanguage(): string {
    return document.documentElement.lang || navigator.language || "en";
}

/** The viewer's language: their profile's, else Home Assistant's, else the browser's. */
export function languageOf(hass: { language?: string; locale?: { language?: string } } | undefined): string {
    return hass?.locale?.language ?? hass?.language ?? browserLanguage();
}
