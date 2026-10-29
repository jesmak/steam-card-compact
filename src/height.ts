/**
 * The card's height: by its content, fixed, or growing up to a limit. A height in grid rows, set in a sections view's
 * layout tab, wins over all three. A card held to a height never gets lower than its own minimum, the height at which
 * what it must always show still fits.
 */
export type HeightMode = "auto" | "fixed" | "max";

export const HEIGHT_MODES: HeightMode[] = ["auto", "fixed", "max"];

export interface HeightConfig {
    height_mode?: HeightMode;
    /** In pixels, for the fixed mode. */
    height?: number;
    /** In pixels, for the max mode. */
    max_height?: number;
    grid_options?: { rows?: unknown };
    /** The older form of `grid_options`, which Home Assistant reads only when there is no `grid_options`. */
    layout_options?: { grid_rows?: unknown };
}

// An option left empty in YAML arrives as null, which means unset like a missing one.
const pixels = (value: unknown) => value == null || (typeof value === "number" && Number.isFinite(value) && value > 0);

/** Whether the mode and the heights are ones the card can use. */
export function validHeight(config: HeightConfig): boolean {
    return (config.height_mode == null || HEIGHT_MODES.includes(config.height_mode)) && pixels(config.height) && pixels(config.max_height);
}

/** The mode chosen, or for a configuration without one, the mode of the height it has. */
export function heightMode(config: HeightConfig): HeightMode {
    return config.height_mode ?? (config.height ? "fixed" : config.max_height ? "max" : "auto");
}

// A sections view's rows, as Home Assistant's frontend lays them out.
const ROW_HEIGHT = 56;
const ROW_GAP = 8;

/**
 * The card's height as an inline style: the whole grid cell when its rows are a number, otherwise the mode's, never
 * lower than `minimum` pixels. The grid cell keeps to the minimum through `gridMinRows`.
 */
export function heightStyle(config: HeightConfig, layout: string | undefined, minimum = 0): string {
    const rows = config.grid_options ? config.grid_options.rows : config.layout_options?.grid_rows;
    if (layout === "grid" && typeof rows === "number") {
        return "height: 100%";
    }
    const mode = heightMode(config);
    if (mode === "fixed" && config.height) {
        return `height: ${Math.max(config.height, minimum)}px`;
    }
    return mode === "max" && config.max_height ? `max-height: ${Math.max(config.max_height, minimum)}px` : "";
}

/** The fewest grid rows that hold `minimum` pixels, for `getGridOptions`' `min_rows`. */
export function gridMinRows(minimum: number): number {
    return Math.max(1, Math.ceil((minimum + ROW_GAP) / (ROW_HEIGHT + ROW_GAP)));
}

/** A masonry view's size in units of 50 px: the content's own, or the height the card is held to. */
export function heightCardSize(config: HeightConfig, content: number, minimum = 0): number {
    const mode = heightMode(config);
    if (mode === "fixed" && config.height) {
        return Math.max(1, Math.round(Math.max(config.height, minimum) / 50));
    }
    return mode === "max" && config.max_height
        ? Math.max(1, Math.min(content, Math.round(Math.max(config.max_height, minimum) / 50)))
        : content;
}

/** The editor's fields: the mode, then the height that mode uses. */
export function heightSchema(config: HeightConfig, text: (key: string) => string): Record<string, unknown>[] {
    const mode = heightMode(config);
    const field = (name: string) => ({
        name,
        selector: { number: { min: 100, max: 2000, step: 10, unit_of_measurement: "px", mode: "box" } },
    });
    return [
        {
            name: "height_mode",
            selector: {
                select: { mode: "dropdown", options: HEIGHT_MODES.map((value) => ({ value, label: text(`editor.height_mode_${value}`) })) },
            },
        },
        ...(mode === "fixed" ? [field("height")] : mode === "max" ? [field("max_height")] : []),
    ];
}

/** The editor's data, with the mode in force shown even when the configuration leaves it out. */
export function heightData<T extends HeightConfig>(config: T): T {
    return { ...config, height_mode: heightMode(config) };
}

/**
 * Drops a mode the configuration would have anyway, so a config edited in the editor stays as short as one written by
 * hand. Both heights are kept, so switching modes back and forth loses neither.
 */
export function tidyHeight<T extends HeightConfig>(config: T): T {
    const tidied = { ...config };
    for (const key of ["height", "max_height"] as const) {
        if (!tidied[key]) {
            delete tidied[key];
        }
    }
    if (!tidied.height_mode || heightMode({ ...tidied, height_mode: undefined }) === tidied.height_mode) {
        delete tidied.height_mode;
    }
    return tidied;
}
