/**
 * How a card on automatic rows in a sections view rounds its height: to whole rows of the view, the default, or to half
 * rows, which saves up to half a row and can leave the cards under it half a row off the rows of the sections beside
 * it. A row is 56 px and the gap between rows 8 px, so k rows are 64k − 8 px and k half rows 32k − 8. Rows set in the
 * layout tab step in whole rows, as Home Assistant has them, and this leaves them alone. A card that grows up to a
 * limit (`height_mode: max`) fills its rows too, up to its limit rounded down to the step. Shared between the cards, so
 * changed in one, copied to all.
 */
import { heightMode, heightStyle } from "./height";
import type { HeightConfig } from "./height";

export type RowStep = "full" | "half";

export const ROW_STEPS: RowStep[] = ["full", "half"];

/** A row of a sections view with the gap under it, and the gap alone. */
export const ROW_PX = 64;
export const ROW_GAP_PX = 8;

export interface RowStepConfig extends HeightConfig {
    row_step?: RowStep | null;
}

/** Left out, or left empty in YAML, the step is whole rows. */
export function validRowStep(config: RowStepConfig): boolean {
    return config.row_step === undefined || config.row_step === null || ROW_STEPS.includes(config.row_step);
}

const step = (config: RowStepConfig) => (config.row_step === "half" ? ROW_PX / 2 : ROW_PX);

/**
 * Room for floating-point noise in a measure unscaled from a drawn one, so a content of whole pixels counts as those
 * pixels. Smaller than the 1/64 px a browser lays out in.
 */
const SLACK_PX = 0.01;

/**
 * How much a card is drawn scaled, 1 unless something scales it, such as a dialog's opening animation (0.8 to 1). Drawn
 * sizes are scaled while the card's padding and margins are not, so a drawn measure is divided by it before they are
 * added. A scale doesn't resize the card, so no ResizeObserver would correct a measure made mid-scale. Its computed
 * width is its border box's, as Home Assistant's `ha-card` is `box-sizing: border-box` (checked on 2026-11-05).
 */
export function drawnScale(card: HTMLElement): number {
    const layout = Number.parseFloat(getComputedStyle(card).width) || 0;
    const drawn = card.getBoundingClientRect().width;
    return layout > 0 && drawn > 0 ? drawn / layout : 1;
}

/**
 * The height that ends `content` pixels on the card's step: at the next whole row, or with half rows the next half, and
 * never over `limit`, which `fillLimit` gives on the step. A content a fraction over a step, such as 120.4, takes the
 * next one, so it isn't rounded before it comes here.
 */
export function filledHeight(content: number, config: RowStepConfig, limit = Infinity): number {
    return Math.min(Math.max(1, Math.ceil((content - SLACK_PX + ROW_GAP_PX) / step(config))) * step(config) - ROW_GAP_PX, limit);
}

/** The whole pixels the `filled` height leaves over `content`, to be given as spare room. */
export function spareRoom(filled: number, content: number): number {
    return Math.max(0, Math.floor(filled - content + SLACK_PX));
}

/**
 * The most a card fills to on automatic rows in a sections view: no limit while it fits its content, its maximum height
 * rounded down to its step while it grows up to one, but never under the steps its `minimum` needs, and 0, no filling
 * at all, outside a sections view or when the card is held to a fixed height or to rows set in the layout tab.
 */
export function fillLimit(config: RowStepConfig, layout: string | undefined, minimum = 0): number {
    const rows = config.grid_options ? config.grid_options.rows : config.layout_options?.grid_rows;
    if (layout !== "grid" || typeof rows === "number") {
        return 0;
    }
    const mode = heightMode(config);
    if (mode === "fixed" && config.height) {
        return 0;
    }
    if (mode !== "max" || !config.max_height) {
        return Infinity;
    }
    const down = Math.floor((config.max_height + ROW_GAP_PX) / step(config)) * step(config) - ROW_GAP_PX;
    return Math.max(down, filledHeight(minimum, config));
}

/**
 * The card's height as an inline style: `heightStyle`'s when it doesn't fill rows, otherwise the `filled` height it
 * fills to, and while it grows up to a limit, that limit as `fillLimit` rounds it.
 */
export function filledStyle(config: RowStepConfig, layout: string | undefined, minimum: number, filled: number): string {
    const limit = fillLimit(config, layout, minimum);
    if (!limit) {
        return heightStyle(config, layout, minimum);
    }
    return [limit < Infinity && `max-height: ${limit}px`, filled && `min-height: ${filled}px`].filter(Boolean).join("; ");
}

/** The editor's field, offered while the card fits its content or grows up to a limit, as only then does it round its height. */
export function rowStepSchema(config: RowStepConfig, text: (key: string) => string): Record<string, unknown>[] {
    if (heightMode(config) === "fixed" && config.height) {
        return [];
    }
    return [
        {
            name: "row_step",
            selector: {
                select: { mode: "dropdown", options: ROW_STEPS.map((value) => ({ value, label: text(`editor.row_step_${value}`) })) },
            },
        },
    ];
}

/** The editor's data, with the step in force shown even when the configuration leaves it out. */
export function rowStepData<T extends RowStepConfig>(config: T): T {
    return { ...config, row_step: config.row_step ?? "full" };
}

/** Drops the default step, and the step of a card held to a fixed height, so an edited config stays as short as one written by hand. */
export function tidyRowStep<T extends RowStepConfig>(config: T): T {
    const tidied = { ...config };
    if (tidied.row_step !== "half" || (heightMode(tidied) === "fixed" && tidied.height)) {
        delete tidied.row_step;
    }
    return tidied;
}
