declare namespace gsap {

  type EnterOrLeaveCallback = (elements: Element[]) => any;
  type SpinFunction = (index: number, element: Element, targets: Element[]) => number;

  interface FlipStateInstance {
    readonly alt: object;
    readonly elementStates: ElementState[];
    readonly idLookup: object;
    readonly props: string;
    readonly simple: boolean;
    readonly targets: Element[];

    update(): void;
    fit(state: FlipStateInstance, scale?: boolean, nested?: boolean): FlipStateInstance;
    recordInlineStyles(): void;
    completeFlips(): void;
    getProperty(element: string | Element, property: string): any;
    getElementState(element: Element): ElementState;
    makeAbsolute(): void;
  }

  interface FlipState {
    new(targetsOrStates: Element[] | ElementState[], vars?: FlipStateVars, targetsAreElementStates?: boolean): FlipStateInstance;
    prototype: FlipStateInstance;
  }

  interface FlipStateVars {
    simple?: boolean;
    props?: string;
  }

  interface ElementState {
    bounds: object;
    cache: object;
    display: string;
    element: Element;
    getProp: Function;
    height: number;
    id: string;
    isVisible: boolean;
    matrix: gsap.plugins.Matrix2D;
    opacity: number;
    parent: Element;
    position: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
    simple: boolean;
    skewX: number;
    width: number;
    x: number;
    y: number;
  }

  interface FlipToFromVars {
    absolute?: boolean;
    fade?: boolean;
    nested?: boolean;
    onEnter?: EnterOrLeaveCallback;
    onLeave?: EnterOrLeaveCallback;
    props?: string;
    scale?: boolean;
    simple?: boolean;
    spin?: number | boolean | SpinFunction;
    targets?: Element | string | null | ArrayLike<Element | string>;
    toggleClass?: string;
    zIndex?: number;

    delay?: TweenValue;
    duration?: TweenValue;
    ease?: string | EaseFunction;
    onComplete?: Callback;
    onRepeat?: Callback;
    onRepeatParams?: any[];
    onReverseComplete?: Callback;
    onStart?: Callback;
    onUpdate?: Callback;
    snap?: object | number;
    stagger?: NumberValue | StaggerVars;
    [key: string]: any;
  }

  interface FitVars {
    absolute?: boolean;
    duration?: number;
    fitChild?: Element | string;
    getVars?: boolean;
    props?: string;
    scale?: boolean;
    simple?: string;

    delay?: TweenValue;
    ease?: string | EaseFunction;
    onComplete?: Callback;
    onRepeat?: Callback;
    onRepeatParams?: any[];
    onReverseComplete?: Callback;
    onStart?: Callback;
    onUpdate?: Callback;
    overwrite?: "auto" | boolean;
    stagger?: NumberValue | StaggerVars;
    snap?: object | number;
    [key: string]: any;
  }

  interface FitReturnVars {
    width?: number;
    height?: number;
    rotation: number;
    scaleX?: number;
    scaleY?: number;
    skewX: number;
    x: number;
    y: number;

    [key: string]: any;
  }

  interface Flip {
    register(core: typeof gsap): void;

    /**
     * Gets the matrix to convert points from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * Flip.convertCoordinates(fromElement, toElement);
     * ```
     *
     * @param {Element} fromElement
     * @param {Element} toElement
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof Flip
     */
    convertCoordinates(fromElement: Element, toElement: Element): gsap.plugins.Matrix2D;
    /**
     * Converts a point from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * Flip.convertCoordinates(fromElement, toElement, point);
     * ```
     *
     * @param {Element} fromElement
     * @param {Element} toElement
     * @param {gsap.Point2D} point
     * @returns {gsap.Point2D} A matrix to convert from one element's coordinate system to another's
     * @memberof Flip
     */
    convertCoordinates(fromElement: Element, toElement: Element, point: Point2D): gsap.Point2D;
    
    /**
     * Changes the x/y/rotation/skewX transforms (and width/height or scaleX/scaleY) to fit one element exactly into the the position/size/rotation of another element.
     *
     * ```js
     * Flip.fit(".el-1", ".el-2", {scale: true, absolute: true, duration: 1, ease: "power2"});
     * ```
     *
     * @param {Element | string} fromElement
     * @param {Element | FlipStateInstance | string} toElement
     * @param {FitVars} vars
     * @returns {core.Tween | FitReturnVars} The Tween instance, or if getVars: true is set, an object containing "x" and "y" properties along with either "width" and "height" (default), or if scale: true is in the vars object, "scaleX" and "scaleY" properties. It will also include any standard tween-related properties ("scale", "getVars", and "absolute" will be stripped out)
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.fit()
     */
    fit(fromElement: Element | string, toElement: Element | FlipStateInstance | string, vars?: FitVars): core.Tween | FitReturnVars;

    /**
     * Animates the targets from the provided state to their current state (position/size).
     *
     * ```js
     * Flip.from(state, {
     *    duration: 1,
     *    ease: "power1.inOut",
     *    stagger: 0.1,
     *    onComplete: () => console.log("done")
     * });
     * ```
     *
     * @param {FlipStateInstance} state
     * @param {FlipToFromVars} vars
     * @returns {core.Timeline} The resulting Timeline animation
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.from()
     */
    from(state: FlipStateInstance, vars?: FlipToFromVars): core.Timeline;

    /**
     * Captures information about the current state of the targets so that they can be Flipped later.
     *
     * ```js
     * const state = Flip.getState(".my-class, .another-class", {props: "backgroundColor,color", simple: true});
     * ```
     *
     * @param {Element | string | null | ArrayLike<Element | string>} targets
     * @param {FlipStateVars | string} vars
     * @returns {FlipStateInstance} The resulting state object
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.getState()
     */
    getState(targets: Element | string | null | ArrayLike<Element | string>, vars?: FlipStateVars | string): FlipStateInstance;

    /**
     * Gets the timeline for the most recently-created flip animation associated with the provided element
     *
     * ```js
     * let tl = Flip.getByTarget("#elementID");
     * ```
     *
     * @param {Element | string} target
     * @returns {core.Timeline | null} The timeline for the most recently-created flip animation associated with the provided element
     * @memberof Flip
     */
    getByTarget(target: Element | string): core.Timeline | null;

    /**
     * Determines whether or not a particular element is actively flipping (has an active flip animation)
     *
     * ```js
     * if (!Flip.isFlipping("#elementID")) {
     *    // do stuff
     * }
     * ```
     *
     * @param {Element | string} target
     * @returns {boolean} whether or not the target element is actively flipping
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.isFlipping()
     */
    isFlipping(target: Element | string): boolean;

    /**
     * Sets all of the provided target elements to position: absolute while retaining their current positioning.
     *
     * ```js
     * Flip.makeAbsolute(".my-class");
     * ```
     *
     * @param {Element | string | null | ArrayLike<Element | string>} targets
     * @returns {Element[]} An Array containing the Elements that were affected
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.makeAbsolute()
     */
     makeAbsolute(targets: Element | string | null | ArrayLike<Element | string>): Element[];

    /**
     * Animates the targets from the current state to the provided state.
     *
     * ```js
     * Flip.to(state, {
     *    duration: 1,
     *    ease: "power1.inOut",
     *    stagger: 0.1,
     *    onComplete: () => console.log("done")
     * });
     * ```
     *
     * @param {FlipStateInstance} state
     * @param {FlipToFromVars} vars
     * @returns {core.Timeline} The resulting Timeline animation
     * @memberof Flip
     * @link https://greensock.com/docs/v3/Plugins/Flip/static.to()
     */
    to(state: FlipStateInstance, vars?: FlipToFromVars): core.Timeline;
  }

}

declare const Flip: gsap.Flip;

declare module "gsap/Flip" {
  export const Flip: gsap.Flip;
  export { Flip as default };
}

declare module "gsap/dist/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap/src/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap/all" {
  export * from "gsap/Flip";
}