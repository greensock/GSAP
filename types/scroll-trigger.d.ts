declare namespace gsap {

  interface AnimationVars {
    scrollTrigger?: string | Element | gsap.plugins.ScrollTriggerInstanceVars;
  }
}

declare namespace gsap.plugins {

  interface ScrollTriggerInstance {
    readonly animation?: gsap.core.Animation;
    readonly direction: number;
    readonly end: number;
    readonly isActive: boolean;
    readonly pin?: Element;
    readonly progress: number;
    readonly scroller: Element;
    readonly start: number;
    readonly trigger?: Element;
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
     * Gets the current velocity of the element's scroll on which the ScrollTrigger is attached to (in pixels per second).
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
     * @param {boolean} allowScrub
     * @memberof ScrollTrigger
     */
    kill(reset?: boolean, allowScrub?: boolean): void;

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
     * Attach a new event listener to a ScrollTrigger event.
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
     * Creates a coordinated group of ScrollTriggers (one for each target element) that batch their callbacks within a certain interval
     *
     * ```js
     * ScrollTrigger.batch(".class", {
     *     interval: 0.1,
     *     batchMax: 3,
     *     onEnter: (elements, triggers) => gsap.to(elements, {opacity: 1, stagger: 0.15, overwrite: true}),
     *     onLeave: (elements, triggers) => gsap.set(elements, {opacity: 0, overwrite: true}),
     *     onEnterBack: (elements, triggers) => gsap.to(elements, {opacity: 1, stagger: 0.15, overwrite: true}),
     *     onLeaveBack: (elements, triggers) => gsap.set(elements, {opacity: 0, overwrite: true})
     * });
     * ```
     *
     * @param {gsap.DOMTarget} targets
     * @param {ScrollTriggerBatchVars} vars
     * @returns {ScrollTriggerInstance[]} An Array of the resulting ScrollTrigger instances
     * @memberof ScrollTrigger
     */
    batch(targets: gsap.DOMTarget, vars: ScrollTriggerBatchVars): ScrollTriggerInstance[];

    /**
     * Configure ScrollTrigger
     *
     * ```js
     * ScrollTrigger.config({limitCallbacks: true, autoRefreshEvents: "resize,load,visibilitychange,DOMContentLoaded"});
     * ```
     *
     * @param {ScrollTriggerConfigVars} vars
     * @memberof ScrollTrigger
     */
    config(vars: ScrollTriggerConfigVars): void;

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
     * Find out if a ScrollTrigger-related scroller is currently scrolling.
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
     * Set up ScrollTriggers that only apply to certain viewport sizes using media queries.
     *
     * ```js
     * ScrollTrigger.matchMedia({
     *     "(min-width: 800px)": function() { },
     *     "(max-width: 799px)": function() { },
     *     "all": function() { }
     * });
     * ```
     *
     * @param {MatchMediaObject} vars
     * @memberof ScrollTrigger
     */
    matchMedia(vars: MatchMediaObject): void;

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
     * Records the current inline CSS styles for the given element(s) so they can be reverted later.
     *
     * ```js
     * ScrollTrigger.saveStyles(".panel, #logo");
     * ```
     *
     * @param {gsap.DOMTarget} targets
     * @memberof ScrollTrigger
     */
    saveStyles(targets: gsap.DOMTarget): void;

    /**
     * Sets up proxy methods for a particular scroller so that you can do advanced effects like integrate with a 3rd party smooth scrolling library.
     *
     * ```js
     * ScrollTrigger.scrollerProxy(".container", {
     *     scrollTop(value) {
     *         return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
     *     },
     *     getBoundingClientRect() {
     *        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
     *     },
     *     pinType: document.querySelector(".container").style.transform ? "transform" : "fixed"
     * });
     * ```
     *
     * @param {string | Element} scroller
     * @param {ScrollerProxyVars} vars
     * @memberof ScrollTrigger
     */
    scrollerProxy(scroller: string | Element, vars: ScrollerProxyVars): void;

    /**
     * Sorts the internal Array of ScrollTriggers by "refreshPriority" first, then by their "start" positions (or by a custom function you provide).
     *
     * ```js
     * ScrollTrigger.sort();
     * ```
     *
     * @param {Function} func
     * @memberof ScrollTrigger
     */
    sort(func?: Function): ScrollTriggerInstance[];

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

  interface RectObj {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  interface MatchMediaObject {
    [key: string]: Function;
  }

  type Callback = (self: ScrollTriggerInstance) => any;
  type BatchCallback = (targets: Element[], triggers: ScrollTriggerInstance[]) => any;
  type NumFunc = () => number;
  type SnapFunc = (value: number) => number;
  type GetterSetterNumFunc = (value?: number) => number | void;
  type GetterRectFunc = () => RectObj;
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
    onRefreshInit?: Callback;
    onSnapComplete?: Callback;
    onScrubComplete?: Callback;
    onUpdate?: Callback;
    onToggle?: Callback;
    pin?: boolean | string | Element;
    pinReparent?: boolean;
    pinSpacing?: boolean | string;
    refreshPriority?: number;
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

  interface ScrollTriggerBatchVars {
    interval?: number;
    batchMax?: number | NumFunc;
    anticipatePin?: number;
    end?: string | number | StartEndFunc;
    horizontal?: boolean;
    once?: boolean;
    onEnter?: BatchCallback;
    onEnterBack?: BatchCallback;
    onLeave?: BatchCallback;
    onLeaveBack?: BatchCallback;
    onRefresh?: BatchCallback;
    onRefreshInit?: Callback;
    onUpdate?: BatchCallback;
    onToggle?: BatchCallback;
    pin?: boolean | string | Element;
    pinReparent?: boolean;
    pinSpacing?: boolean | string;
    scroller?: string | Element;
    start?: string | number | StartEndFunc;
    toggleClass?: string | ToggleClassVars;
  }

  interface ScrollTriggerConfigVars {
    limitCallbacks?: boolean;
    syncInterval?: number;
    autoRefreshEvents?: string;
  }

  interface ScrollerProxyVars {
    scrollTop?: GetterSetterNumFunc;
    scrollLeft?: GetterSetterNumFunc;
    scrollWidth?: GetterSetterNumFunc;
    scrollHeight?: GetterSetterNumFunc;
    getBoundingClientRect?: GetterRectFunc;
    pinType?: "fixed" | "transform";
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