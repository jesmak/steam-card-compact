import { describe, expect, it } from "vitest";

import { fillLimit, filledHeight, filledStyle, rowStepData, rowStepSchema, tidyRowStep, validRowStep } from "../src/rows";
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

    it("never fills past its limit", () => {
        expect(filledHeight(121, {}, 376)).toBe(184);
        expect(filledHeight(380, {}, 376)).toBe(376);
        expect(filledHeight(900, { row_step: "half" }, 376)).toBe(376);
    });

    it.each<[string, RowStepConfig, string | undefined, number, number]>([
        ["fills with no limit while it fits its content", {}, "grid", 200, Infinity],
        ["rounds a maximum height down to whole rows", { max_height: 400 }, "grid", 0, 376],
        ["rounds a maximum height down to half rows", { max_height: 400, row_step: "half" }, "grid", 0, 376],
        ["keeps a maximum height already on the rows", { max_height: 376 }, "grid", 0, 376],
        ["rounds down to the half row under it", { max_height: 395, row_step: "half" }, "grid", 0, 376],
        ["keeps a half row under the next whole one", { max_height: 350, row_step: "half" }, "grid", 0, 344],
        ["never goes under the rows its minimum needs", { max_height: 230 }, "grid", 218, 248],
        ["never goes under one step", { max_height: 30 }, "grid", 0, 56],
        ["fills a max mode with no height as one that fits its content", { height_mode: "max" }, "grid", 0, Infinity],
        ["fills a fixed mode with no height as one that fits its content", { height_mode: "fixed" }, "grid", 0, Infinity],
        ["doesn't fill a fixed height", { height: 300 }, "grid", 0, 0],
        ["doesn't fill rows set in the layout tab", { max_height: 400, grid_options: { rows: 4 } }, "grid", 0, 0],
        ["doesn't fill rows in the older form", { layout_options: { grid_rows: 4 } }, "grid", 0, 0],
        ["fills automatic rows set in the layout tab", { max_height: 400, grid_options: { rows: "auto" } }, "grid", 0, 376],
        ["doesn't fill outside a sections view", { max_height: 400 }, undefined, 0, 0],
        ["doesn't fill in a panel view", {}, "panel", 0, 0],
    ])("%s", (_name, config, layout, minimum, limit) => {
        expect(fillLimit(config, layout, minimum)).toBe(limit);
    });

    it.each<[string, RowStepConfig, string | undefined, number, number, string]>([
        ["fits its content with nothing filled yet", {}, "grid", 0, 0, ""],
        ["fills its rows", {}, "grid", 0, 248, "min-height: 248px"],
        ["fills its rows up to its rounded limit", { max_height: 400 }, "grid", 0, 248, "max-height: 376px; min-height: 248px"],
        ["keeps its rounded limit with nothing filled yet", { max_height: 400 }, "grid", 0, 0, "max-height: 376px"],
        ["keeps its maximum height outside a sections view", { max_height: 400 }, undefined, 0, 248, "max-height: 400px"],
        ["raises its maximum height to its minimum outside a sections view", { max_height: 200 }, undefined, 230, 0, "max-height: 230px"],
        ["keeps a fixed height", { height: 300 }, "grid", 0, 248, "height: 300px"],
        [
            "takes the whole cell of rows set in the layout tab",
            { max_height: 400, grid_options: { rows: 4 } },
            "grid",
            0,
            248,
            "height: 100%",
        ],
    ])("styles a card that %s", (_name, config, layout, minimum, filled, style) => {
        expect(filledStyle(config, layout, minimum, filled)).toBe(style);
    });

    it("accepts whole and half rows, and a step left out or empty, and nothing else", () => {
        expect([undefined, null, "full", "half"].every((row_step) => validRowStep({ row_step } as never))).toBe(true);
        expect(["quarter", 2, true].some((row_step) => validRowStep({ row_step } as never))).toBe(false);
    });

    it("offers the step while the card fits its content or grows up to a limit, never held to a fixed height", () => {
        const text = (key: string) => key;
        expect(rowStepSchema({}, text).map((entry) => entry.name)).toEqual(["row_step"]);
        expect(rowStepSchema({ height_mode: "max", max_height: 300 }, text).map((entry) => entry.name)).toEqual(["row_step"]);
        expect(rowStepSchema({ height: 300 }, text)).toEqual([]);
    });

    it("shows whole rows in the editor when the configuration leaves the step out", () => {
        expect(rowStepData<RowStepConfig>({}).row_step).toBe("full");
        expect(rowStepData({ row_step: "half" }).row_step).toBe("half");
    });

    it.each([
        ["keeps half rows", { row_step: "half" as const }, { row_step: "half" }],
        ["drops the default", { row_step: "full" as const }, {}],
        [
            "keeps half rows of a card growing up to a limit",
            { row_step: "half" as const, max_height: 400 },
            { row_step: "half", max_height: 400 },
        ],
        ["drops the step of a card held to a fixed height", { row_step: "half" as const, height: 300 }, { height: 300 }],
    ])("%s when tidied", (_name, config, tidied) => {
        expect(tidyRowStep(config)).toEqual(tidied);
    });
});
