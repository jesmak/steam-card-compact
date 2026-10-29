import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactiveController } from "lit";

import { ScrollFade, markFade } from "../src/fade";

/** A part with the sizes a browser would lay out, which happy-dom doesn't. */
function part(content: number, height: number, scrolled = 0): HTMLElement {
    const element = document.createElement("div");
    element.append(document.createElement("div"));
    Object.defineProperty(element, "scrollHeight", { value: content, configurable: true });
    Object.defineProperty(element, "clientHeight", { value: height, configurable: true });
    Object.defineProperty(element, "scrollTop", { value: scrolled, writable: true, configurable: true });
    return element;
}

const fades = (element: HTMLElement) => ["fade-top", "fade-bottom"].filter((name) => element.classList.contains(name));

/** A card's lifecycle, as Lit drives a reactive controller through it. */
function host() {
    let controller: ReactiveController | undefined;
    const element = Object.assign(document.createElement("div"), {
        hasUpdated: false,
        addController: (added: ReactiveController) => (controller = added),
        removeController: () => undefined,
        requestUpdate: () => undefined,
        updateComplete: Promise.resolve(true),
    });
    document.body.append(element);
    return {
        element,
        rendered: () => {
            element.hasUpdated = true;
            controller!.hostUpdated!();
        },
        left: () => {
            element.remove();
            controller!.hostDisconnected!();
        },
        back: () => {
            document.body.append(element);
            controller!.hostConnected!();
        },
    };
}

describe("the fade at a scrolling part's edges", () => {
    it.each<[string, number, number, number, string[]]>([
        ["content that fits", 200, 200, 0, []],
        ["content a pixel over, from rounding", 201, 200, 0, []],
        ["content a pixel over, scrolled a pixel", 201, 200, 1, []],
        ["content two pixels over, the least that fades", 202, 200, 0, ["fade-bottom"]],
        ["content two pixels over, scrolled a pixel, where both edges spare it", 202, 200, 1, []],
        ["content two pixels over, scrolled to its end", 202, 200, 2, ["fade-top"]],
        ["more below, at the top", 500, 200, 0, ["fade-bottom"]],
        ["a pixel down from the top, from rounding", 500, 200, 1, ["fade-bottom"]],
        ["two pixels down from the top", 500, 200, 2, ["fade-top", "fade-bottom"]],
        ["more both ways, in the middle", 500, 200, 150, ["fade-top", "fade-bottom"]],
        ["two pixels short of the end", 500, 200, 298, ["fade-top", "fade-bottom"]],
        ["a pixel short of the end, from rounding", 500, 200, 299, ["fade-top"]],
        ["scrolled to the end", 500, 200, 300, ["fade-top"]],
        ["scrolled a pixel and a half, at a zoom", 500, 200, 1.5, ["fade-top", "fade-bottom"]],
        ["half a pixel short of the end, at a zoom", 500, 200, 299.5, ["fade-top"]],
        ["a pixel and a bit down from the top, at a zoom", 500, 200, 1.4, ["fade-top", "fade-bottom"]],
        ["a pixel and a half short of the end, at a zoom", 500, 200, 298.5, ["fade-top", "fade-bottom"]],
        ["pulled past the top, as an elastic overscroll", 500, 200, -5, ["fade-bottom"]],
        ["pulled past the end, as an elastic overscroll", 500, 200, 305, ["fade-top"]],
        ["content that fits, pulled past the top", 200, 200, -5, []],
        ["content that fits, pulled past the end", 200, 200, 5, []],
        ["content a pixel over, pulled past the top", 201, 200, -5, []],
        ["content a pixel over, pulled past the end", 201, 200, 6, []],
    ])("for %s", (_name, content, height, scrolled, expected) => {
        const element = part(content, height, scrolled);
        markFade(element);
        expect(fades(element)).toEqual(expected);
    });

    it("drops a fade once the content fits again", () => {
        const element = part(500, 200);
        markFade(element);
        Object.defineProperty(element, "scrollHeight", { value: 200 });
        markFade(element);
        expect(fades(element)).toEqual([]);
    });
});

describe("following a card's scrolling parts", () => {
    it("marks the parts after each render and follows them as they scroll", () => {
        const card = host();
        const first = part(500, 200);
        new ScrollFade(card.element, () => [first]);
        card.rendered();
        expect(fades(first)).toEqual(["fade-bottom"]);
        expect(first.classList.contains("fades")).toBe(true);

        first.scrollTop = 300;
        first.dispatchEvent(new Event("scroll"));
        expect(fades(first)).toEqual(["fade-top"]);
    });

    it("lets go of a part no longer given, and clears its fades", () => {
        const card = host();
        const first = part(500, 200);
        let given = [first];
        new ScrollFade(card.element, () => given);
        card.rendered();
        given = [];
        card.rendered();
        expect(fades(first)).toEqual([]);
        expect(first.classList.contains("fades")).toBe(false);

        first.scrollTop = 300;
        first.dispatchEvent(new Event("scroll"));
        expect(fades(first)).toEqual([]);
    });

    it("lets go when the card leaves the page, and follows again when it comes back, with no render between", () => {
        const card = host();
        const first = part(500, 200);
        new ScrollFade(card.element, () => [first]);
        card.rendered();
        card.left();
        expect(fades(first)).toEqual([]);

        card.back();
        expect(fades(first)).toEqual(["fade-bottom"]);
        first.scrollTop = 300;
        first.dispatchEvent(new Event("scroll"));
        expect(fades(first)).toEqual(["fade-top"]);
    });

    it("doesn't follow again when the card renders after leaving the page", () => {
        const card = host();
        const first = part(500, 200);
        new ScrollFade(card.element, () => [first]);
        card.rendered();
        card.left();
        card.rendered();
        expect(first.classList.contains("fades")).toBe(false);
        expect(fades(first)).toEqual([]);
    });

    it("keeps its class on a part whose class attribute a render writes again", () => {
        const card = host();
        const first = part(500, 200);
        new ScrollFade(card.element, () => [first]);
        card.rendered();
        first.setAttribute("class", "rows with-days");
        card.rendered();
        expect(first.classList.contains("fades")).toBe(true);
        expect(fades(first)).toEqual(["fade-bottom"]);
    });

    it("does nothing when the card comes to the page before its first render", () => {
        const card = host();
        let asked = 0;
        new ScrollFade(card.element, () => {
            asked++;
            return [];
        });
        card.back();
        expect(asked).toBe(0);
    });

    describe("with a resize observer", () => {
        let observed = new Set<Element>();
        let fire: (targets: Element[]) => void = () => undefined;
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        function stub() {
            observed = new Set();
            vi.stubGlobal(
                "ResizeObserver",
                class {
                    constructor(callback: (entries: { target: Element }[]) => void) {
                        fire = (targets) => callback(targets.map((target) => ({ target })));
                    }
                    observe(target: Element) {
                        observed.add(target);
                    }
                    unobserve(target: Element) {
                        observed.delete(target);
                    }
                },
            );
        }

        it("marks a part again when its content changes size without a render, as a fold sliding shut", () => {
            stub();
            const card = host();
            const first = part(500, 200);
            const child = first.firstElementChild!;
            new ScrollFade(card.element, () => [first]);
            card.rendered();
            expect(observed.has(first) && observed.has(child)).toBe(true);
            expect(fades(first)).toEqual(["fade-bottom"]);

            Object.defineProperty(first, "scrollHeight", { value: 200 });
            fire([child]);
            expect(fades(first)).toEqual([]);
        });

        it("marks a part again when it changes size itself, as a held card growing into its limit", () => {
            stub();
            const card = host();
            const first = part(500, 200);
            new ScrollFade(card.element, () => [first]);
            card.rendered();
            Object.defineProperty(first, "clientHeight", { value: 500 });
            fire([first]);
            expect(fades(first)).toEqual([]);
        });

        it("ignores a size change of a part it has let go", () => {
            stub();
            const card = host();
            const first = part(500, 200);
            const child = first.firstElementChild!;
            let given = [first];
            new ScrollFade(card.element, () => given);
            card.rendered();
            given = [];
            card.rendered();
            fire([first, child]);
            expect(fades(first)).toEqual([]);
        });

        it("watches the children a render brings, and stops watching the ones it takes away", () => {
            stub();
            const card = host();
            const first = part(500, 200);
            const old = first.firstElementChild!;
            new ScrollFade(card.element, () => [first]);
            card.rendered();
            const added = document.createElement("div");
            first.replaceChildren(added);
            card.rendered();
            expect(observed.has(added)).toBe(true);
            expect(observed.has(old)).toBe(false);

            card.left();
            expect(observed.size).toBe(0);
        });
    });
});
