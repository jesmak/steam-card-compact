import { describe, expect, it } from "vitest";

import { gridMinRows, heightCardSize, heightMode, heightStyle, tidyHeight, validHeight } from "../src/height";
import type { HeightConfig } from "../src/height";

describe("the card's height", () => {
    it.each<[string, HeightConfig, string | undefined, string]>([
        ["nothing set fits the content", {}, undefined, ""],
        ["a height alone is fixed", { height: 240 }, undefined, "height: 240px"],
        ["a maximum height alone is a limit", { max_height: 400 }, undefined, "max-height: 400px"],
        ["both heights without a mode are fixed", { height: 240, max_height: 400 }, undefined, "height: 240px"],
        ["the max mode uses the maximum height", { height_mode: "max", height: 240, max_height: 400 }, undefined, "max-height: 400px"],
        ["the auto mode ignores both heights", { height_mode: "auto", height: 240, max_height: 400 }, undefined, ""],
        ["a mode without its height fits the content", { height_mode: "fixed", max_height: 400 }, undefined, ""],
        ["grid rows that are a number win", { height: 240, grid_options: { rows: 6 } }, "grid", "height: 100%"],
        ["automatic grid rows leave the mode in force", { max_height: 400, grid_options: { rows: "auto" } }, "grid", "max-height: 400px"],
        ["an empty height fits the content", { height: null as unknown as number }, undefined, ""],
        [
            "an empty mode leaves the height's",
            { height_mode: null as unknown as HeightConfig["height_mode"], max_height: 400 },
            undefined,
            "max-height: 400px",
        ],
        ["grid rows outside a sections view do nothing", { height: 240, grid_options: { rows: 6 } }, undefined, "height: 240px"],
        ["the older layout options' rows, without grid options", { height: 240, layout_options: { grid_rows: 6 } }, "grid", "height: 100%"],
        [
            "grid options over the older layout options",
            { height: 240, grid_options: { rows: "auto" }, layout_options: { grid_rows: 6 } },
            "grid",
            "height: 240px",
        ],
        [
            "empty grid options over the older layout options",
            { height: 240, grid_options: {}, layout_options: { grid_rows: 6 } },
            "grid",
            "height: 240px",
        ],
        [
            "grid options left empty in YAML, so the older layout options",
            { height: 240, grid_options: null as unknown as undefined, layout_options: { grid_rows: 6 } },
            "grid",
            "height: 100%",
        ],
        ["the older layout options' automatic rows", { height: 240, layout_options: { grid_rows: "auto" } }, "grid", "height: 240px"],
        [
            "the older layout options' rows outside a sections view",
            { height: 240, layout_options: { grid_rows: 6 } },
            undefined,
            "height: 240px",
        ],
    ])("%s", (_name, config, layout, style) => {
        expect(heightStyle(config, layout)).toBe(style);
    });

    it.each<[string, HeightConfig, string | undefined, string]>([
        ["a fixed height below the minimum is raised to it", { height: 150 }, undefined, "height: 200px"],
        ["a fixed height above the minimum stays", { height: 300 }, undefined, "height: 300px"],
        ["a limit below the minimum is raised to it", { max_height: 150 }, undefined, "max-height: 200px"],
        ["the content's own height has no minimum", {}, undefined, ""],
        ["grid rows fill the cell, which min_rows keeps high enough", { height: 150, grid_options: { rows: 1 } }, "grid", "height: 100%"],
    ])("with a minimum of 200 px, %s", (_name, config, layout, style) => {
        expect(heightStyle(config, layout, 200)).toBe(style);
    });

    it.each<[number, number]>([
        [0, 1],
        [56, 1],
        [57, 2],
        [120, 2],
        [121, 3],
        [200, 4],
    ])("holds %i px in %i grid rows", (minimum, rows) => {
        expect(gridMinRows(minimum)).toBe(rows);
    });

    it("sizes a masonry card held below its minimum by the minimum", () => {
        expect(heightCardSize({ height: 100 }, 7, 300)).toBe(6);
        expect(heightCardSize({ max_height: 100 }, 7, 300)).toBe(6);
    });

    it.each<[string, HeightConfig, number]>([
        ["fits the content", {}, 7],
        ["fixed, by the height", { height: 240 }, 5],
        ["a limit above the content", { max_height: 1000 }, 7],
        ["a limit below the content", { max_height: 200 }, 4],
        ["has an empty height", { height: null as unknown as number }, 7],
        ["has an empty mode and a height", { height_mode: null as unknown as HeightConfig["height_mode"], height: 240 }, 5],
    ])("sizes a masonry card that %s", (_name, config, size) => {
        expect(heightCardSize(config, 7)).toBe(size);
    });

    it.each<[string, HeightConfig, boolean]>([
        ["nothing", {}, true],
        ["a mode and its height", { height_mode: "fixed", height: 240 }, true],
        ["an unknown mode", { height_mode: "tall" as HeightConfig["height_mode"] }, false],
        ["a height of zero", { height: 0 }, false],
        ["a height as text", { max_height: "400px" as unknown as number }, false],
        // An option left empty in YAML arrives as null and means the default, as everywhere else in the cards.
        ["an empty height", { height: null as unknown as number }, true],
        ["an empty maximum height", { max_height: null as unknown as number }, true],
        ["an empty mode", { height_mode: null as unknown as HeightConfig["height_mode"], height: 240 }, true],
    ])("accepts %s or not", (_name, config, valid) => {
        expect(validHeight(config)).toBe(valid);
    });

    // The configuration keeps only the height the mode in force uses, so a height left from another mode can't come back
    // when the mode is switched again, and the mode only when its heights don't already say it.
    it.each<[string, HeightConfig, HeightConfig]>([
        ["drops the auto mode with no heights", { height_mode: "auto" }, {}],
        ["drops both heights in the auto mode", { height_mode: "auto", height: 240, max_height: 400 }, {}],
        ["drops the fixed mode its height implies", { height_mode: "fixed", height: 240 }, { height: 240 }],
        ["drops the maximum height in the fixed mode", { height_mode: "fixed", height: 240, max_height: 400 }, { height: 240 }],
        ["keeps the fixed mode while its height is emptied", { height_mode: "fixed", max_height: 400 }, { height_mode: "fixed" }],
        ["drops the max mode its height implies", { height_mode: "max", max_height: 400 }, { max_height: 400 }],
        ["drops the fixed height in the max mode", { height_mode: "max", height: 240, max_height: 400 }, { max_height: 400 }],
        ["keeps the max mode while its height is emptied", { height_mode: "max", height: 240 }, { height_mode: "max" }],
        ["keeps the fixed height of both, with no mode", { height: 240, max_height: 400 }, { height: 240 }],
        ["drops an emptied height", { height_mode: "max", height: undefined, max_height: 400 }, { max_height: 400 }],
        ["drops a height left empty", { height: null as unknown as number, max_height: 400 }, { max_height: 400 }],
        ["drops a mode left empty", { height_mode: null as unknown as HeightConfig["height_mode"], height: 240 }, { height: 240 }],
    ])("tidies an edited configuration: %s", (_name, config, tidied) => {
        const result = tidyHeight(config);
        expect(result).toEqual(tidied);
        expect(heightMode(result)).toBe(heightMode(config));
    });
});
