/**
 * How a card on automatic rows in a sections view rounds its height: to whole rows of the view, the default, or to half
 * rows, which saves up to half a row and can leave the cards under it half a row off the rows of the sections beside
 * it. A row is 56 px and the gap between rows 8 px, so k rows are 64k − 8 px and k half rows 32k − 8. Rows set in the
 * layout tab step in whole rows, as Home Assistant has them, and this leaves them alone. Shared between the cards, so
 * changed in one, copied to all.
 */
import { heightMode } from "./height";
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

/** The height that ends `content` pixels on the card's step: at the next whole row, or with half rows the next half. */
export function filledHeight(content: number, config: RowStepConfig): number {
    const step = config.row_step === "half" ? ROW_PX / 2 : ROW_PX;
    return Math.max(1, Math.ceil((content + ROW_GAP_PX) / step)) * step - ROW_GAP_PX;
}

/** The editor's field, offered only while the card fits its content, as only then does it round its height. */
export function rowStepSchema(config: RowStepConfig, text: (key: string) => string): Record<string, unknown>[] {
    if (heightMode(config) !== "auto") {
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

/** Drops the default step, and the step of a card that doesn't fit its content, so an edited config stays as short as one written by hand. */
export function tidyRowStep<T extends RowStepConfig>(config: T): T {
    const tidied = { ...config };
    if (tidied.row_step !== "half" || heightMode(tidied) !== "auto") {
        delete tidied.row_step;
    }
    return tidied;
}
