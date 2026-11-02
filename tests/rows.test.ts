import { describe, expect, it } from "vitest";

import { filledHeight, rowStepData, rowStepSchema, tidyRowStep, validRowStep } from "../src/rows";
import type { RowStepConfig } from "../src/rows";

describe("the card's row step", () => {
    it.each([
        ["a whole row", 120, {}, 120],
        ["just over a row, up to the next whole one", 121, {}, 184],
        ["half a row and a row, up to two", 88, {}, 120],
        ["half a row and a row, kept with half rows", 88, { row_step: "half" as const }, 88],
        ["just over half a row and a row, up to two with half rows", 89, { row_step: "half" as const }, 120],
        ["nothing, still one step", 0, {}, 56],
        ["nothing with half rows, still one half", 0, { row_step: "half" as const }, 24],
        ["an empty step, as whole rows", 88, { row_step: null }, 120],
    ])("rounds %s", (_name, content, config, filled) => {
        expect(filledHeight(content, config)).toBe(filled);
    });

    it("accepts whole and half rows, and a step left out or empty, and nothing else", () => {
        expect([undefined, null, "full", "half"].every((row_step) => validRowStep({ row_step } as never))).toBe(true);
        expect(["quarter", 2, true].some((row_step) => validRowStep({ row_step } as never))).toBe(false);
    });

    it("offers the step only while the card fits its content", () => {
        const text = (key: string) => key;
        expect(rowStepSchema({}, text).map((entry) => entry.name)).toEqual(["row_step"]);
        expect(rowStepSchema({ height: 300 }, text)).toEqual([]);
        expect(rowStepSchema({ height_mode: "max", max_height: 300 }, text)).toEqual([]);
    });

    it("shows whole rows in the editor when the configuration leaves the step out", () => {
        expect(rowStepData<RowStepConfig>({}).row_step).toBe("full");
        expect(rowStepData({ row_step: "half" }).row_step).toBe("half");
    });

    it.each([
        ["keeps half rows", { row_step: "half" as const }, { row_step: "half" }],
        ["drops the default", { row_step: "full" as const }, {}],
        ["drops the step of a card held to a height", { row_step: "half" as const, height: 300 }, { height: 300 }],
    ])("%s when tidied", (_name, config, tidied) => {
        expect(tidyRowStep(config)).toEqual(tidied);
    });
});
