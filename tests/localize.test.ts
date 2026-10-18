import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { STATUSES } from "../src/const";
import { LANGUAGE_CODES, translate } from "../src/localize/localize";

// The tests run from the repository root.
const FOLDER = join(process.cwd(), "src", "localize", "languages");

function keys(table: Record<string, unknown>, prefix = ""): string[] {
    return Object.entries(table).flatMap(([key, value]) =>
        value !== null && typeof value === "object" ? keys(value as Record<string, unknown>, `${prefix}${key}.`) : [`${prefix}${key}`],
    );
}

function language(code: string): Record<string, unknown> {
    return JSON.parse(readFileSync(join(FOLDER, `${code}.json`), "utf8"));
}

describe("languages", () => {
    it("are every JSON file in the languages folder", () => {
        const files = readdirSync(FOLDER)
            .filter((file) => file.endsWith(".json"))
            .map((file) => file.replace(/\.json$/, "").toLowerCase())
            .sort();
        expect(LANGUAGE_CODES).toEqual(files);
        expect(LANGUAGE_CODES).toContain("en");
    });

    it.each(LANGUAGE_CODES.filter((code) => code !== "en"))("%s has no keys that English lacks", (code) => {
        const english = new Set(keys(language("en")));
        expect(keys(language(code)).filter((key) => !english.has(key))).toEqual([]);
    });

    it("fall back to English for a text a language lacks, and to the key for one nobody has", () => {
        expect(translate("fi", "statuses.online")).toBe("Paikalla");
        expect(translate("fi-FI", "statuses.online")).toBe("Paikalla");
        expect(translate("sv", "statuses.away")).toBe("Away");
        expect(translate("fi", "no.such.key")).toBe("no.such.key");
    });
});

describe("texts", () => {
    it.each(LANGUAGE_CODES)("%s names every group the card lists", (code) => {
        for (const status of STATUSES) {
            expect(translate(code, `statuses.${status}`), status).not.toBe(`statuses.${status}`);
        }
    });

    it.each(LANGUAGE_CODES)("%s covers every unit of time the card can show", (code) => {
        for (const unit of ["seconds", "minutes", "hours", "days", "weeks"]) {
            expect(translate(code, `time_units.${unit}`), unit).not.toBe(`time_units.${unit}`);
        }
    });
});
