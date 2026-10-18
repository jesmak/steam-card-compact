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

/** A text in the viewer's language, falling back to English. Keys are dotted, such as `common.name`. */
export function translate(language: string | undefined, key: string): string {
    const code = (language ?? "en").split(/[-_]/)[0].toLowerCase();
    return read(LANGUAGES[code], key) ?? read(LANGUAGES.en, key) ?? key;
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
