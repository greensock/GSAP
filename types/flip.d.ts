declare class Flip {

  static readonly version: string;
  
  /**
   * Gets the matrix to convert points from one element's local coordinates into a
   * different element's local coordinate system.
   *
   * ```js
   * Flip.convertCoordinates(fromElement, toElement);
   * ```
   *
   * @static
   * @param {Element} fromElement
   * @param {Element} toElement
   * @returns {gsap.plugins.Matrix2D} A matrix to convert from one element's coordinate system to another's
   * @memberof Flip
   */
  static convertCoordinates(fromElement: Element, toElement: Element): gsap.plugins.Matrix2D;
    
  /**
   * Converts a point from one element's local coordinates into a
   * different element's local coordinate system.
   *
   * ```js
   * Flip.convertCoordinates(fromElement, toElement, point);
   * ```
   *
   * @static
   * @param {Element} fromElement
   * @param {Element} toElement
   * @param {gsap.Point2D} point
   * @returns {gsap.Point2D} A point to convert from one element's coordinate system to another's
   * @memberof Flip
   */
  static convertCoordinates(fromElement: Element, toElement: Element, point: gsap.Point2D): gsap.Point2D;
   
  /**
   * Changes the x/y/rotation/skewX transforms (and width/height or scaleX/scaleY) to fit one element exactly into the the position/size/rotation of another element.
   * 
   * ```js
   * Flip.fit("#el1", "#el2", {
   *   scale: true, 
   *   absolute: true, 
   *   duration: 1, 
   *   ease: "power2"
   * });
   * ```
   *
   * @static
   * @param {gsap.DOMTarget} fromElement
   * @param {(gsap.DOMTarget | Flip.FlipState)} toElement
   * @param {Flip.FitVars} [vars]
   * @returns {(object | null)}
   * @memberof Flip
   */
  static fit(fromElement: gsap.DOMTarget, toElement: gsap.DOMTarget | Flip.FlipState, vars?: Flip.FitVars): object | null;

  /**
   * Animates the targets from the provided state to their current state (position/size).
   * 
   * ```js
   * Flip.from(state, {
   *   duration: 1,
   *   ease: "power1.inOut",
   *   stagger: 0.1,
   *   onComplete: () => console.log("done")
   * });
   * ```
   *
   * @static
   * @param {Flip.FlipState} state
   * @param {Flip.FromToVars} [vars]
   * @returns {gsap.core.Timeline} Flip timeline
   * @memberof Flip
   * @link https://greensock.com/docs/v3/Plugins/Flip/static.from()
   */
  static from(state: Flip.FlipState, vars?: Flip.FromToVars): gsap.core.Timeline;

  /**
   * Captures information about the current state of the targets so that they can be Flipped later.
   * 
   * ```js
   * let state = Flip.getState(".my-class, .another-class", {props: "backgroundColor,color", simple: true});
   * ```
   *
   * @static
   * @param {gsap.DOMTarget} targets
   * @param {(Flip.FlipStateVars | string)} [vars]
   * @returns {Flip.FlipState} The resulting state object
   * @memberof Flip
   * @link https://greensock.com/docs/v3/Plugins/Flip/static.getState()
   */
  static getState(targets: gsap.DOMTarget, vars?: Flip.FlipStateVars | string): Flip.FlipState;

  /**
   * Gets the timeline for the most recently-created flip animation associated with the provided element
   *
   * ```js
   * let tl = Flip.getByTarget("#elementID");
   * ```
   *
   * @static
   * @param {Element | string} target
   * @returns {core.Timeline | null} The timeline for the most recently-created flip animation associated with the provided element
   * @memberof Flip
   */
  static getByTarget(target: Element | string): gsap.core.Timeline | null;

  /**
   * Determines whether or not a particular element is actively flipping (has an active flip animation)
   *
   * ```js
   * if (!Flip.isFlipping("#elementID")) {
   *   // do stuff
   * }
   * ```
   * 
   * @static
   * @param {gsap.DOMTarget} target
   * @returns {boolean} whether or not the target element is actively flipping
   * @memberof Flip
   * @link https://greensock.com/docs/v3/Plugins/Flip/static.isFlipping()
   */
  static isFlipping(target: gsap.DOMTarget): boolean;

  /**
   * Sets all of the provided target elements to position: absolute while retaining their current positioning.
   *
   * ```js
   * Flip.makeAbsolute(".my-class");
   * ```
   *
   * @static
   * @param {Element | string | null | ArrayLike<Element | string>} targets
   * @returns {Element[]} An Array containing the Elements that were affected
   * @memberof Flip
   * @link https://greensock.com/docs/v3/Plugins/Flip/static.makeAbsolute()
   */
  static makeAbsolute(targets: gsap.DOMTarget): Element[];

  /**
   * Animates the targets from the current state to the provided state.
   * 
   * ```js
   * Flip.to(state, {
   *   duration: 1,
   *   ease: "power1.inOut",
   *   stagger: 0.1,
   *   onComplete: () => console.log("done")
   * });
   * ```
   *
   * @static
   * @param {Flip.FlipState} state
   * @param {Flip.FromToVars} [vars]
   * @returns {gsap.core.Timeline} Flip timeline
   * @memberof Flip
   * @link https://greensock.com/docs/v3/Plugins/Flip/static.to()
   */
  static to(state: Flip.FlipState, vars?: Flip.FromToVars): gsap.core.Timeline;

  /**
   * Registers Flip with gsap
   *
   * @static
   * @param {typeof gsap} core
   * @memberof Flip
   */
  static register(core: typeof gsap): void;
}

declare namespace Flip {

  type OverrideProps<M, N> = { [P in keyof M]: P extends keyof N ? N[P] : M[P] };

  type EnterOrLeaveCallback = (elements: Element[]) => any;
  type SpinFunction = (index: number, element: Element, targets: Element[]) => number;
  
  interface TweenVarOverrides {
    scale?: boolean;
  }

  interface AnimationVars extends OverrideProps<gsap.TweenVars, TweenVarOverrides> {
    absolute?: boolean;
    simple?: boolean;
    props?: string;
  }

  interface FlipStateVars {
    simple?: boolean;
    props?: string;
  }

  interface FromToVars extends AnimationVars {
    fade?: boolean;
    nested?: boolean;
    onEnter?: EnterOrLeaveCallback;
    onLeave?: EnterOrLeaveCallback;
    spin?: number | boolean | SpinFunction;
    targets?: gsap.DOMTarget;
    toggleClass?: string;
    zIndex?: number;
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
  interface FitVars extends AnimationVars {
    fitChild?: gsap.DOMTarget;
    getVars?: boolean;
  }
  
  class ElementState {

    readonly bounds: DOMRect;
    readonly cache: object;
    readonly display: string;
    readonly element: Element;
    readonly getProp: Function;
    readonly height: number;
    readonly id: string;
    readonly isVisible: boolean;
    readonly matrix: gsap.plugins.Matrix2D;
    readonly opacity: number;
    readonly parent: Element;
    readonly position: string;
    readonly rotation: number;
    readonly scaleX: number;
    readonly scaleY: number;
    readonly simple: boolean;
    readonly skewX: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
  }

  class FlipState {

    readonly alt: object;
    readonly elementStates: ElementState[];
    readonly idLookup: object;
    readonly props: string;
    readonly simple: boolean;
    readonly targets: Element[];

    update(): void;
    fit(state: FlipState, scale?: boolean, nested?: boolean): this;
    recordInlineStyles(): void;
    completeFlips(): void;
    getProperty(element: string | Element, property: string): any;
    getElementState(element: Element): ElementState;
    makeAbsolute(): void;
  }
}

declare namespace gsap {

  /**
   * @deprecated since 3.7.0
   * @see Flip.ElementState
   */
  type ElementState = any;

  /**
   * @deprecated since 3.7.0
   * @see Flip.EnterOrLeaveCallback
   */
  type EnterOrLeaveCallback = Flip.EnterOrLeaveCallback;

  /**
   * @deprecated since 3.7.0
   * @see Flip.FitVars
   */
  type FitVars = Flip.FitVars;

   /**
    * @deprecated since 3.7.0
    * @see Flip.FitReturnVars
    */
  type FitReturnVars = Flip.FitReturnVars;

  /**
   * @deprecated since 3.7.0
   * @see Flip
   */
  type Flip = any;

  /**
   * @deprecated since 3.7.0
   * @see Flip.FlipState
   */
  type FlipState = any;

  /**
   * @deprecated since 3.7.0
   * @see Flip.FlipStateVars
   */
  type FlipStateVars = Flip.FlipStateVars;

  /**
   * @deprecated since 3.7.0
   * @see Flip.FromToVars
   */
  type FlipToFromVars = Flip.FromToVars;  

  /**
   * @deprecated since 3.7.0
   * @see Flip.SpinFunction
   */
  type SpinFunction = Flip.SpinFunction;
}

declare module "gsap/Flip" {
  class _Flip extends Flip { }
  export {
    _Flip as Flip,
    _Flip as default
  }
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

declare module "gsap-trial/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap-trial/dist/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap-trial/src/Flip" {
  export * from "gsap/Flip";
  export { Flip as default } from "gsap/Flip";
}

declare module "gsap-trial/all" {
  export * from "gsap/Flip";
}
