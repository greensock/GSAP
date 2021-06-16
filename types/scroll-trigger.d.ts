declare namespace gsap {

  interface AnimationVars {
    scrollTrigger?: gsap.DOMTarget | ScrollTrigger.Vars;
  }
}

declare class ScrollTrigger {

  static readonly version: string;

  readonly animation?: gsap.core.Animation;
  readonly direction: number;
  readonly end: number;
  readonly isActive: boolean;
  readonly pin?: Element;
  readonly progress: number;
  readonly scroller: Element | Window;
  readonly start: number;
  readonly trigger?: Element;
  readonly vars: ScrollTrigger.Vars;

  /**
   * Creates an instance of ScrollTrigger.
   * @param {ScrollTrigger.StaticVars} vars
   * @param {gsap.core.Animation} [animaiton]
   * @memberof ScrollTrigger
   */
  constructor(vars: ScrollTrigger.StaticVars, animaiton?:  gsap.core.Animation);

  /**
   * Attach a new event listener to a ScrollTrigger event.
   *
   * ```js
   * ScrollTrigger.addEventListener("scrollStart", myFunc);
   * ```
   *
   * @static
   * @param {"scrollStart" | "scrollEnd" | "refreshInit" | "refresh"} event
   * @param {gsap.Callback} callback
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.addEventListener()
   */
  static addEventListener(event: "scrollStart" | "scrollEnd" | "refreshInit" | "refresh", callback: gsap.Callback): void;

  /**
   * Creates a coordinated group of ScrollTriggers (one for each target element) that batch their callbacks within a certain interval
   *
   * ```js
   * ScrollTrigger.batch(".class", {
   *   interval: 0.1,
   *   batchMax: 3,
   *   onEnter: (elements, triggers) => gsap.to(elements, {opacity: 1, stagger: 0.15, overwrite: true}),
   *   onLeave: (elements, triggers) => gsap.set(elements, {opacity: 0, overwrite: true}),
   *   onEnterBack: (elements, triggers) => gsap.to(elements, {opacity: 1, stagger: 0.15, overwrite: true}),
   *   onLeaveBack: (elements, triggers) => gsap.set(elements, {opacity: 0, overwrite: true})
   * });
   * ```
   *
   * @static
   * @param {gsap.DOMTarget} targets
   * @param {ScrollTrigger.BatchVars} vars
   * @returns {ScrollTriggerInstance[]} An Array of the resulting ScrollTrigger instances
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.batch()
   */
  static batch(targets: gsap.DOMTarget, vars: ScrollTrigger.BatchVars): ScrollTrigger[];

  /**
   * Un-registers .matchMedia() break points (or just one).
   *
   * ```js
   * ScrollTrigger.clearMatchMedia();
   * ```
   *
   * @static
   * @param {string} name
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.clearMatchMedia()
   */
  static clearMatchMedia(name?: string): void;

  /**
   * Configure ScrollTrigger
   *
   * ```js
   * ScrollTrigger.config({
   *   limitCallbacks: true, 
   *   autoRefreshEvents: "resize,load,visibilitychange,DOMContentLoaded"
   * });
   * ```
   *
   * @static
   * @param {ScrollTrigger.ConfigVars} vars
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.config()
   */
  static config(vars: ScrollTrigger.ConfigVars): void;

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
   * @static
   * @param {ScrollTrigger.StaticVars} vars
   * @returns {ScrollTrigger} The ScrollTrigger
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()
   */
  static create(vars: ScrollTrigger.StaticVars): ScrollTrigger;

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
   * @static
   * @param {ScrollTrigger.StaticVars} vars
   * @returns {ScrollTrigger} The ScrollTrigger
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.defaults()
   */
  static defaults(vars: ScrollTrigger.StaticVars): ScrollTrigger;

  /**
   * Returns all ScrollTriggers that exist.
   *
   * ```js
   * ScrollTrigger.getAll("myID");
   * ```
   *
   * @static
   * @returns {ScrollTrigger[]} The ScrollTrigger
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.getAll()
   */
  static getAll(): ScrollTrigger[];

  /**
   * Returns the ScrollTrigger that was assigned the corresponding id.
   *
   * ```js
   * ScrollTrigger.getById("myID");
   * ```
   *
   * @static
   * @param {string} id
   * @returns {ScrollTriggerInstance} The ScrollTrigger
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.getById()
   */
  static getById(id: string): ScrollTrigger;

  /**
   * Returns a function to control the scroll position of a particular element
   * 
   * ```js
   * let setScroll = ScrollTrigger.getScrollFunc(window);
   * setScroll(250);
   * ```
   *
   * @static
   * @param {(gsap.DOMTarget | Window)} element
   * @param {boolean} [horizontal]
   * @returns {ScrollTrigger.ScrollFunc}
   * @memberof ScrollTrigger
   */
  static getScrollFunc(element: gsap.DOMTarget | Window, horizontal?: boolean): ScrollTrigger.ScrollFunc;

  /**
   * Find out if a ScrollTrigger-related scroller is currently scrolling.
   *
   * ```js
   * ScrollTrigger.isScrolling();
   * ```
   *
   * @static
   * @returns {boolean} Whether or not the scroller is scrolling
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.isScrolling()
   */
  static isScrolling(): boolean;

  /**
   * Set up ScrollTriggers that only apply to certain viewport sizes using media queries.
   *
   * ```js
   * ScrollTrigger.matchMedia({
   *   "(min-width: 800px)": function() { },
   *   "(max-width: 799px)": function() { },
   *   "all": function() { }
   * });
   * ```
   *
   * @static
   * @param {ScrollTrigger.MatchMediaObject} vars
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.matchMedia()
   */
  static matchMedia(vars: ScrollTrigger.MatchMediaObject): void;

  /**
   * Get the maximum scroll value for any given element.
   *
   * ```js
   * ScrollTrigger.maxScroll(window);
   * ```
   *
   * @static
   * @param {(HTMLElement | Window)} target
   * @param {boolean} [horizontal]
   * @returns {number} The max distance the element can scroll
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.maxScroll()
   */
  static maxScroll(target: HTMLElement | Window, horizontal?: boolean): number;

  /**
   * Recalculates the positioning of all of the ScrollTriggers on the page.
   *
   * ```js
   * ScrollTrigger.refresh();
   * ```
   *
   * @static
   * @param {boolean} safe
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.refresh()
   */
  static refresh(safe?: boolean): void;

  /**
   * Registers ScrollTrigger with gsap
   *
   * @static
   * @param {typeof gsap} core
   * @memberof ScrollTrigger
   */
  static register(core: typeof gsap): void;

  /**
   * Removes an event listener for a ScrollTrigger event.
   *
   * ```js
   * ScrollTrigger.removeEventListener("scrollStart", myFunc);
   * ```
   *
   * @static
   * @param {"scrollStart" | "scrollEnd" | "refreshInit" | "refresh"} event
   * @param {gsap.Callback} callback
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.removeEventListener()
   */
  static removeEventListener(event: "scrollStart" | "scrollEnd" | "refreshInit" | "refresh", callback: gsap.Callback): void;

  /**
   * Records the current inline CSS styles for the given element(s) so they can be reverted later.
   *
   * ```js
   * ScrollTrigger.saveStyles(".panel, #logo");
   * ```
   *
   * @static
   * @param {gsap.DOMTarget} targets
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.targets()
   */
  static saveStyles(targets: gsap.DOMTarget): void;

  /**
   * Sets up proxy methods for a particular scroller so that you can do advanced effects like integrate with a 3rd party smooth scrolling library.
   *
   * ```js
   * ScrollTrigger.scrollerProxy(".container", {
   *   scrollTop(value) {
   *     return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
   *   },
   *   getBoundingClientRect() {
   *     return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
   *   },
   *   pinType: document.querySelector(".container").style.transform ? "transform" : "fixed"
   * });
   * ```
   *
   * @static
   * @param {gsap.DOMTarget} scroller
   * @param {ScrollTrigger.ScrollerProxyVars} vars
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy()
   */
  static scrollerProxy(scroller: gsap.DOMTarget, vars: ScrollTrigger.ScrollerProxyVars): void;

  /**
   * Sorts the internal Array of ScrollTriggers by "refreshPriority" first, then by their "start" positions (or by a custom function you provide).
   *
   * ```js
   * ScrollTrigger.sort();
   * ```
   *
   * @static
   * @param {Function} func
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.sort()
   */
  static sort(func?: Function): ScrollTrigger[];

  /**
   * Checks where the scrollbar is and updates all ScrollTrigger instances' progress and direction values accordingly, controls the animation (if necessary) and fires the appropriate callbacks.
   *
   * ```js
   * ScrollTrigger.update();
   * ```
   *
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.update()
   */
  static update(): void;

  /**
   * Stops all of the ScrollTrigger's callbacks and removes any added markup and padding caused by pinning.
   *
   * ```js
   * scrollTrigger.disable();
   * scrollTrigger.disable(true);
   * ```
   * 
   * @param {boolean} revert
   * @param {boolean} allowAnimation
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/disable()
   */
  disable(revert?: boolean, allowAnimation?: boolean): void;

  /**
   * Re-enables a disabled ScrollTrigger instance.
   *
   * ```js
   * scrollTrigger.enable();
   * ```
   *
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/enable()
   */
  enable(): void;

  /**
   * Gets the scrub tween associated with the ScrollTrigger instance (if scrub was defined), or getTween(true) will get the snap tween (assuming snap was defined).
   *
   * ```js
   * let scrub = scrollTrigger.getTween();
   * scrub.progress(1); // immediately finish the scrub
   * ```
   *
   * @param {boolean} snap
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/getTween()
   */
  getTween(snap?: boolean): gsap.core.Tween;

  /**
   * Gets the current velocity of the element's scroll on which the ScrollTrigger is attached to (in pixels per second).
   *
   * ```js
   * scrollTrigger.getVelocity();
   * ```
   *
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/getVelocity()
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
   * @param {boolean} allowAnimation
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/kill()
   */
  kill(reset?: boolean, allowAnimation?: boolean): void;

  /**
   * Gets the scroll position of the ScrollTrigger's scroller.
   *
   * ```js
   * scrollTrigger.scroll();
   * ```
   *
   * @returns {number} The scroll position of the scroller
   * @memberof ScrollTrigger
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/scroll()
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
   * @link https://greensock.com/docs/v3/Plugins/ScrollTrigger/scroll()
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

declare namespace ScrollTrigger {

  interface RectObj {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  interface MatchMediaObject {
    [key: string]: Function;
  }

  type Callback = (self: ScrollTrigger) => any;
  type BatchCallback = (targets: Element[], triggers: ScrollTrigger[]) => any;
  type NumFunc = () => number;
  type SnapFunc = (value: number) => number;
  type GetterSetterNumFunc = (value?: number) => number | void;
  type GetterRectFunc = () => RectObj;
  type StartEndFunc = () => string | number;
  type ScrollFunc = (position: number) => void;

  interface MarkersVars {
    endColor?: string;
    fontSize?: string;
    fontWeight?: string;
    indent?: number;
    startColor?: string;
  }

  interface ToggleClassVars {
    className: string;
    targets?: gsap.DOMTarget;
  }

  interface SnapVars {
    delay?: number;
    duration?: number | RangeObject;
    inertia?: boolean;
    ease?: string | gsap.EaseFunction;
    snapTo?: number | number[] | "labels" | "labelsDirectional" | SnapFunc;
    onInterrupt?: Callback;
    onStart?: Callback;
    onComplete?: Callback;
  }

  interface RangeObject {
    min?: number;
    max?: number;
  }

  interface Vars {
    anticipatePin?: number;
    end?: string | number | StartEndFunc;
    endTrigger?: gsap.DOMTarget;
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
    pin?: boolean | gsap.DOMTarget;
    pinnedContainer?: gsap.DOMTarget;
    pinReparent?: boolean;
    pinSpacing?: boolean | string;
    pinType?: "fixed" | "transform";
    refreshPriority?: number;
    scroller?: gsap.DOMTarget | Window;
    scrub?: boolean | number;
    snap?: number | number[] | "labels" | "labelsDirectional" | SnapFunc | SnapVars;
    start?: string | number | StartEndFunc;
    toggleActions?: string;
    toggleClass?: string | ToggleClassVars;
    trigger?: gsap.DOMTarget;
  }

  interface StaticVars extends Vars {
    animation?: gsap.core.Animation;
  }

  interface BatchVars {
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
    pin?: boolean | gsap.DOMTarget;
    pinReparent?: boolean;
    pinSpacing?: boolean | string;
    pinType?: "fixed" | "transform";
    scroller?: gsap.DOMTarget | Window;
    start?: string | number | StartEndFunc;
    toggleClass?: string | ToggleClassVars;
  }

  interface ConfigVars {
    limitCallbacks?: boolean;
    syncInterval?: number; // TODO: Add to docs?
    autoRefreshEvents?: string;
  }

  interface ScrollerProxyVars {
    scrollTop?: GetterSetterNumFunc;
    scrollLeft?: GetterSetterNumFunc;
    scrollWidth?: GetterSetterNumFunc;
    scrollHeight?: GetterSetterNumFunc;
    fixedMarkers?: boolean;
    getBoundingClientRect?: GetterRectFunc;
    pinType?: "fixed" | "transform";
  }
}

declare namespace gsap.plugins {

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.ScrollerProxyVars
   */
  type ScrollerProxyVars = ScrollTrigger.ScrollerProxyVars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger
   */
  type ScrollTrigger = any;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.BatchVars
   */
  type ScrollTriggerBatchVars = ScrollTrigger.BatchVars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.ConfigVars
   */
  type ScrollTriggerConfigVars = ScrollTrigger.ConfigVars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger
   */
  class ScrollTriggerInstance extends ScrollTrigger {}

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.Vars
   */
  type ScrollTriggerInstanceVars = ScrollTrigger.Vars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger
   */
  class ScrollTriggerStatic extends ScrollTrigger {}

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.StaticVars
   */
  type ScrollTriggerStaticVars = ScrollTrigger.StaticVars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.SnapVars;
   */
  type SnapVars = ScrollTrigger.SnapVars;

  /**
   * @deprecated since 3.7.0
   * @see ScrollTrigger.ToggleClassVars
   */
  type ToggleClassVars = ScrollTrigger.ToggleClassVars;
}

declare module "gsap/ScrollTrigger" {
  class _ScrollTrigger extends ScrollTrigger { }
  export {
    _ScrollTrigger as ScrollTrigger,
    _ScrollTrigger as default
  }
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
