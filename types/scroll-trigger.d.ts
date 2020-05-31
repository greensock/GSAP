declare namespace gsap {

  interface AnimationVars {
    scrollTrigger?: string | Element | gsap.plugins.ScrollTriggerInstanceVars;
  }
}

declare namespace gsap.plugins {

  interface ScrollTriggerInstance {
    readonly animation: gsap.core.Animation;
    readonly direction: number;
    readonly end: number;
    readonly isActive: boolean;
    readonly pin?: Element;
    readonly progress: number;
    readonly scroller: Element;
    readonly start: number;
    readonly trigger: Element;
    readonly vars: ScrollTriggerInstanceVars;


    /**
     * Stops all of the ScrollTrigger's callbacks and removes any added markup and padding caused by pinning.
     *
     * ```js
     * scrollTrigger.disable();
     * ```
     *
     * @memberof ScrollTrigger
     */
    disable(): void;

    /**
     * Re-enables a disabled ScrollTrigger instance.
     *
     * ```js
     * scrollTrigger.enable();
     * ```
     *
     * @memberof ScrollTrigger
     */
    enable(): void;

    /**
     * Gets the current velocity of the element's scroll on which the ScrollTrigger is attached to.
     *
     * ```js
     * scrollTrigger.disable();
     * ```
     *
     * @memberof ScrollTrigger
     */
    getVelocity(): number;

    /**
     * Removes all added markup, stops all callbacks, and frees it for GC.
     *
     * ```js
     * scrollTrigger.kill();
     * ```
     *
     * @param {boolean} reset
     * @memberof ScrollTrigger
     */
    kill(reset?: boolean): void;

    /**
     * Gets the scroll position of the ScrollTrigger's scroller.
     *
     * ```js
     * scrollTrigger.scroll();
     * ```
     *
     * @returns {number} The scroll position of the scroller
     * @memberof ScrollTrigger
     */
    scroll(): number;
    /**
     * Sets the scroll position of the ScrollTrigger's scroller.
     *
     * ```js
     * scrollTrigger.scroll(100);
     * ```
     *
     * @param {number} position
     * @memberof ScrollTrigger
     */
    scroll(position: number): void;

    /**
     * Animates the scroll position of the ScrollTrigger's scroller.
     *
     * ```js
     * scrollTrigger.tweenTo(100);
     * ```
     *
     * @param {number} position
     * @memberof ScrollTrigger
     */
    tweenTo(position: number): void;
  }



  interface ScrollTriggerStatic extends Plugin {
    /**
     * Attatch a new event listener to a ScrollTrigger event.
     *
     * ```js
     * ScrollTrigger.addEventListener("scrollStart", myFunc);
     * ```
     *
     * @param {"scrollStart" | "scrollEnd" | "refreshInit" | "refresh"} event
     * @param {gsap.Callback} callback
     * @memberof ScrollTrigger
     */
    addEventListener(event: "scrollStart" | "scrollEnd" | "refreshInit" | "refresh", callback: gsap.Callback): void;

    /**
     * Create scroll triggers that aren't directly connected to a tween or timeline.
     *
     * ```js
     * ScrollTrigger.create({
     *   trigger: "#id",
     *   start: "top top",
     *   end: "bottom 50%+=100px"
     * });
     * ```
     *
     * @param {ScrollTrigger.Vars} vars
     * @returns {ScrollTriggerInstance} The ScrollTrigger
     * @memberof ScrollTrigger
     */
    create(vars: ScrollTriggerStaticVars): ScrollTriggerInstance;

    /**
     * Set the default values that apply to every ScrollTrigger upon creation.
     *
     * ```js
     * ScrollTrigger.defaults({
     *   toggleActions: "restart pause resume none",
     *   markers: {startColor: "white", endColor: "white", fontSize: "18px", indent: 10}
     * });
     * ```
     *
     * @param {ScrollTrigger.Vars} vars
     * @returns {ScrollTriggerInstance} The ScrollTrigger
     * @memberof ScrollTrigger
     */
    defaults(vars: ScrollTriggerStaticVars): ScrollTriggerInstance;


    /**
     * Returns all ScrollTriggers that exist.
     *
     * ```js
     * ScrollTrigger.getAll("myID");
     * ```
     *
     * @returns {ScrollTriggerInstance[]} The ScrollTrigger
     * @memberof ScrollTrigger
     */
    getAll(): ScrollTriggerInstance[];

    /**
     * Returns the ScrollTrigger that was assigned the corresponding id.
     *
     * ```js
     * ScrollTrigger.getById("myID");
     * ```
     *
     * @param {string} id
     * @returns {ScrollTriggerInstance} The ScrollTrigger
     * @memberof ScrollTrigger
     */
    getById(id: string): ScrollTriggerInstance;

    /**
     * Find out if a ScrollTrigger-related scroller is currently scrolling
     *
     * ```js
     * ScrollTrigger.isScrolling();
     * ```
     *
     * @returns {boolean} Whether or not the scroller is scrolling
     * @memberof ScrollTrigger
     */
    isScrolling(): boolean;

    /**
     * Get the maximum scroll value for any given element.
     *
     * ```js
     * ScrollTrigger.maxScroll(window);
     * ```
     *
     * @returns {number} The max distance the element can scroll
     * @memberof ScrollTrigger
     */
    maxScroll(target: Element): number;

    /**
     * Recalculates the positioning of all of the ScrollTriggers on the page.
     *
     * ```js
     * ScrollTrigger.refresh();
     * ```
     *
     * @param {boolean} safe
     * @memberof ScrollTrigger
     */
    refresh(safe?: boolean): void;

    /**
     * Removes an event listener for a ScrollTrigger event.
     *
     * ```js
     * ScrollTrigger.removeEventListener("scrollStart", myFunc);
     * ```
     *
     * @param {"scrollStart" | "scrollEnd" | "refreshInit" | "refresh"} event
     * @param {gsap.Callback} callback
     * @memberof ScrollTrigger
     */
    removeEventListener(event: "scrollStart" | "scrollEnd" | "refreshInit" | "refresh", callback: gsap.Callback): void;

    /**
     * Checks where the scrollbar is and updates all ScrollTrigger instances' progress and direction values accordingly, controls the animation (if necessary) and fires the appropriate callbacks.
     *
     * ```js
     * ScrollTrigger.update();
     * ```
     *
     * @memberof ScrollTrigger
     */
    update(): void;
  }

  interface ScrollTrigger extends ScrollTriggerStatic {
    new(): PluginScope & ScrollTriggerInstance;
    prototype: PluginScope & ScrollTriggerInstance;
    register(core: typeof gsap): void;
  }

  type Callback = (self: ScrollTriggerInstance) => any;
  type SnapFunc = (value: number) => number;
  type StartEndFunc = () => string | number;

  interface MarkersVars {
    endColor?: string;
    fontSize?: string;
    fontWeight?: string;
    indent?: number;
    startColor?: string;
  }

  interface ToggleClassVars {
    class: string;
    targets?: gsap.DOMTarget;
  }

  interface SnapVars {
    delay?: number;
    duration?: number | RangeObject;
    ease?: gsap.Ease;
    snapTo?: number | number[] | "labels" | SnapFunc;
  }

  interface RangeObject {
    min?: number;
    max?: number;
  }

  interface ScrollTriggerInstanceVars {
    anticipatePin?: number;
    end?: string | number | StartEndFunc;
    endTrigger?: string | Element;
    horizontal?: boolean;
    id?: string;
    invalidateOnRefresh?: boolean;
    markers?: boolean | MarkersVars;
    once?: boolean;
    onEnter?: Callback;
    onEnterBack?: Callback;
    onLeave?: Callback;
    onLeaveBack?: Callback;
    onRefresh?: Callback;
    onSnapComplete?: Callback;
    onScrubComplete?: Callback;
    onUpdate?: Callback;
    onToggle?: Callback;
    pin?: boolean | string | Element;
    pinReparent?: boolean;
    pinSpacing?: boolean | string;
    scroller?: string | Element;
    scrub?: boolean | number;
    snap?: number | number[] | "labels" | SnapFunc | SnapVars;
    start?: string | number | StartEndFunc;
    toggleActions?: string;
    toggleClass?: string | ToggleClassVars;
    trigger?: string | Element;
  }

  interface ScrollTriggerStaticVars extends ScrollTriggerInstanceVars {
    animation?: gsap.core.Animation;
  }
}

declare const ScrollTrigger: gsap.plugins.ScrollTrigger;

declare module "gsap/ScrollTrigger" {
  export const ScrollTrigger: gsap.plugins.ScrollTrigger;
  export { ScrollTrigger as default };
}

declare module "gsap/dist/ScrollTrigger" {
  export * from "gsap/ScrollTrigger";
  export { ScrollTrigger as default } from "gsap/ScrollTrigger";
}

declare module "gsap/src/ScrollTrigger" {
  export * from "gsap/ScrollTrigger";
  export { ScrollTrigger as default } from "gsap/ScrollTrigger";
}

declare module "gsap/all" {
  export * from "gsap/ScrollTrigger";
}