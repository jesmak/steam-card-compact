/**
 * A fade at the edge of a part that scrolls, where its content runs on past that edge: at the bottom while there is
 * more below, at the top once it has been scrolled down. A part whose content fits shows no fade. The fade is 24 px, but
 * never more than a quarter of the part, so a card held to its minimum still shows the row it is held to show. Which of
 * the fade and the card's own scrollbar a part shows is the card's `scroll_indicator` option, its default the card's
 * own. The file is copied as it is between the cards, so it describes uses a card may not have, such as a sticky
 * header's `--fade-top-offset`.
 */
import { css } from "lit";
import type { ReactiveController, ReactiveControllerHost } from "lit";

/** How a part that scrolls shows that there is more: by its fading edges, by the card's scrollbar, or by both. */
export type ScrollIndicator = "both" | "fade" | "scrollbar";

export const SCROLL_INDICATORS: ScrollIndicator[] = ["both", "fade", "scrollbar"];

export interface ScrollIndicatorConfig {
    scroll_indicator?: ScrollIndicator | null;
}

/** Left out, or left empty in YAML, the card's own default is used. */
export function validScrollIndicator(config: ScrollIndicatorConfig): boolean {
    return config.scroll_indicator === undefined || config.scroll_indicator === null || SCROLL_INDICATORS.includes(config.scroll_indicator);
}

/** The indicator in force, the card's `fallback` unless the configuration sets one. */
export function scrollIndicator(config: ScrollIndicatorConfig, fallback: ScrollIndicator): ScrollIndicator {
    return config.scroll_indicator ?? fallback;
}

/** The editor's field. */
export function scrollIndicatorSchema(text: (key: string) => string): Record<string, unknown>[] {
    return [
        {
            name: "scroll_indicator",
            selector: {
                select: {
                    mode: "dropdown",
                    options: SCROLL_INDICATORS.map((value) => ({ value, label: text(`editor.scroll_indicator_${value}`) })),
                },
            },
        },
    ];
}

/** The editor's data, with the indicator in force shown even when the configuration leaves it out. */
export function scrollIndicatorData<T extends ScrollIndicatorConfig>(config: T, fallback: ScrollIndicator): T {
    return { ...config, scroll_indicator: scrollIndicator(config, fallback) };
}

/** Drops the card's default indicator, so an edited config stays as short as one written by hand. */
export function tidyScrollIndicator<T extends ScrollIndicatorConfig>(config: T, fallback: ScrollIndicator): T {
    const tidied = { ...config };
    if (scrollIndicator(tidied, fallback) === fallback) {
        delete tidied.scroll_indicator;
    }
    return tidied;
}

/**
 * The fades, for the card's styles. A part with a header that stays at its top (`position: sticky`) sets
 * `--fade-top-offset` to the header's height, so the top fade starts under it. A followed part keeps what keyboard focus
 * scrolls into view clear of its fades.
 */
export const fadeStyles = css`
    .fades {
        --fade-length: min(24px, 25%);
        scroll-padding-block: calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)) var(--fade-length, 24px);
    }

    .fade-top {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px))
        );
    }

    .fade-bottom {
        mask-image: linear-gradient(to top, transparent, #000 var(--fade-length, 24px));
    }

    .fade-top.fade-bottom {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)),
            #000 calc(100% - var(--fade-length, 24px)),
            transparent
        );
    }

    /* Over the card's own scrollbar style, whatever its selector. */
    .scroll-hidden {
        scrollbar-width: none !important;
    }

    .scroll-hidden::-webkit-scrollbar {
        display: none;
    }
`;

/** Marks a part by where its content runs past its edges. A pixel to spare keeps rounding from showing a fade. */
export function markFade(part: HTMLElement): void {
    const hidden = part.scrollHeight - part.clientHeight;
    part.classList.toggle("fade-top", hidden > 1 && part.scrollTop > 1);
    part.classList.toggle("fade-bottom", hidden > 1 && hidden - part.scrollTop > 1);
}

const onScroll = (event: Event) => markFade(event.currentTarget as HTMLElement);

/**
 * Follows a card's scrolling parts, given by `parts`, after every render and while they scroll, resize or their content
 * changes size without a render (a fold sliding open). A card's `parts` may give none, such as while the card isn't held
 * to a height, and nothing fades then. Nothing fades either while `indicator` gives `scrollbar`, and with `fade` the
 * parts hide their scrollbar. Coming back to the page, the card's parts are followed again without waiting for a
 * render, and leaving it lets them go.
 */
export class ScrollFade implements ReactiveController {
    /** Each followed part with the children whose size it watches. */
    private readonly followed = new Map<HTMLElement, Element[]>();
    private readonly resized =
        typeof ResizeObserver === "undefined"
            ? undefined
            : new ResizeObserver((entries) => {
                  for (const { target } of entries) {
                      const part = this.followed.has(target as HTMLElement) ? target : target.parentElement;
                      if (part && this.followed.has(part as HTMLElement)) {
                          markFade(part as HTMLElement);
                      }
                  }
              });

    constructor(
        private readonly host: ReactiveControllerHost & HTMLElement & { hasUpdated: boolean },
        private readonly parts: () => Iterable<HTMLElement>,
        private readonly indicator: () => ScrollIndicator,
    ) {
        host.addController(this);
    }

    public hostConnected(): void {
        if (this.host.hasUpdated) {
            this.follow();
        }
    }

    public hostUpdated(): void {
        // A card can render after it has left the page, when its own disconnect code changes its state.
        if (this.host.isConnected) {
            this.follow();
        }
    }

    public hostDisconnected(): void {
        for (const part of [...this.followed.keys()]) {
            this.forget(part);
        }
    }

    private follow(): void {
        const indicator = this.indicator();
        const now = new Set(indicator === "scrollbar" ? [] : this.parts());
        for (const part of [...this.followed.keys()]) {
            if (!now.has(part)) {
                this.forget(part);
            }
        }
        for (const part of now) {
            if (!this.followed.has(part)) {
                part.addEventListener("scroll", onScroll, { passive: true });
                this.resized?.observe(part);
            }
            // Every time, as a render that binds the part's class attribute writes the whole attribute again.
            part.classList.add("fades");
            part.classList.toggle("scroll-hidden", indicator === "fade");
            // The children change between renders, so the ones watched are brought up to date each time.
            const before = this.followed.get(part) ?? [];
            const children = [...part.children];
            before.filter((child) => !children.includes(child)).forEach((child) => this.resized?.unobserve(child));
            children.filter((child) => !before.includes(child)).forEach((child) => this.resized?.observe(child));
            this.followed.set(part, children);
            markFade(part);
        }
    }

    private forget(part: HTMLElement): void {
        this.followed.get(part)?.forEach((child) => this.resized?.unobserve(child));
        this.followed.delete(part);
        part.removeEventListener("scroll", onScroll);
        this.resized?.unobserve(part);
        part.classList.remove("fades", "fade-top", "fade-bottom", "scroll-hidden");
    }
}
