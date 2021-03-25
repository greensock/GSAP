declare namespace gsap {

  type RegisterablePlugins = 
    | Ease
    | EasePack
    | ExpoScaleEase
    | Plugin
    | RoughEase
    | SteppedEase
    | VelocityTracker
    | typeof core.Animation
    | typeof core.Tween
    | typeof core.Timeline
    | typeof Draggable
    | typeof GSDevTools
    | typeof MotionPathHelper
    | typeof SplitText
    | typeof Flip;

  // querySelector returns type Element | null
  type DOMTarget = Element | string | null | ArrayLike<Element | string | null>;
  type TweenTarget = string | object | null; 

  type Callback = (...args: any[]) => void | null;
  type CallbackType = "onComplete" | "onInterrupt" | "onRepeat" | "onReverseComplete" | "onStart" | "onUpdate";
  type TickerCallback = (time: number, deltaTime: number, frame: number, elapsed: number) => void | null;

  type Point2D = { x: number, y: number };
  type Position = number | string;
  
  type FunctionBasedValue<T> = (index: number, target: any, targets: any[]) => T;
  type ArrayValue = any[] | FunctionBasedValue<any[]>;
  type BooleanValue = boolean | FunctionBasedValue<boolean>;
  type NumberValue = number | FunctionBasedValue<number>;
  type StringValue = string | FunctionBasedValue<string>;
  type ElementValue = Element | FunctionBasedValue<Element>;
  type TweenValue = NumberValue | StringValue;
  
  type SVGPathValue = string | SVGPathElement;
  type SVGPathTarget = SVGPathValue | ArrayLike<SVGPathValue>;
  type SVGPrimitive = SVGCircleElement | SVGRectElement | SVGEllipseElement | SVGPolygonElement | SVGPolylineElement | SVGLineElement;

  interface AnimationVars extends CallbackVars {
    [key: string]: any;
    data?: any;    
    id?: string | number;
    inherit?: boolean;
    paused?: boolean;
    repeat?: number;
    repeatDelay?: number;
    repeatRefresh?: boolean;
    reversed?: boolean;
    yoyo?: boolean;
  }  

  interface CallbackVars {
    callbackScope?: object;
    onComplete?: Callback;
    onCompleteParams?: any[];
    onRepeat?: Callback;
    onRepeatParams?: any[];
    onReverseComplete?: Callback;
    onReverseCompleteParams?: any[];
    onStart?: Callback;
    onStartParams?: any[];
    onUpdate?: Callback;
    onUpdateParams?: any[];
  }

  interface EaseMap {
    [key: string]: EaseFunction;
  }

  interface EffectsMap {
    [key: string]: any;
  }

  interface GSAPConfig {
    autoKillThreshold?: number;
    autoSleep?: number;
    force3D?: "auto" | boolean;
    nullTargetWarn?: boolean;
    resistance?: number;
    stringFilter?: Callback; // TODO: Find out signature
    unitFactors?: { time?: number, totalTime?: number };
    units?: GSAPUnits
  }

  type GSAPUnits = {
    bottom?: string
    fontSize?: string
    height?: string
    left?: string
    lineHeight?: string
    margin?: string
    padding?: string
    perspective?: string
    right?: string
    rotation?: string
    rotationX?: string
    rotationY?: string
    skewX?: string
    skewY?: string
    top?: string
    width?: string
    x?: string
    y?: string
    z?: string
  } & {
    [key: string]: string
  }
  
  interface StaggerVars extends CallbackVars, utils.DistributeConfig {
    repeat?: number;
    repeatDelay?: number;
    yoyo?: boolean;
    yoyoEase?: boolean | string | EaseFunction;
  }

  interface Ticker {
    add(callback: TickerCallback): void;
    fps(fps: number): void;
    frame: number;
    lagSmoothing(threshold: number, adjustedLag?: number): void;
    remove(callback: Callback): void;
    sleep(): void;
    tick(): void;
    time: number;
    deltaRatio(fps?: number): number;
    wake(): void;
  }

  interface TimelineVars extends AnimationVars {
    autoRemoveChildren?: boolean;
    defaults?: TweenVars;
    delay?: number;
    smoothChildTiming?: boolean;
  }

  interface TweenVars extends AnimationVars {
    delay?: TweenValue;
    duration?: TweenValue;
    ease?: string | EaseFunction;
    endArray?: any[];
    immediateRender?: boolean;    
    lazy?: boolean;
    keyframes?: TweenVars[];
    onInterrupt?: Callback;
    onInterruptParams?: any[];
    overwrite?: "auto" | boolean;
    runBackwards?: boolean;
    stagger?: NumberValue | StaggerVars;
    startAt?: TweenVars;
    yoyoEase?: boolean | string | EaseFunction;
  }

  const effects: EffectsMap;

  const globalTimeline: core.Timeline;

  const ticker: Ticker;

  const version: string;

  /**
   * Gets or sets GSAP's global configuration settings.
   * 
   * Options: autoSleep, force3D, nullTargetWarn, and units
   * 
   * ```js
   * gsap.config({force3D: false});
   * ```
   *
   * @param {GSAPConfig} [config]
   * @returns {GSAPConfig} Configuration object
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.config()
   */
  function config(config?: GSAPConfig): GSAPConfig;

  /**
   * Gets or sets GSAP's global defaults. These will be inherited by every tween.
   * 
   * ```js
   * gsap.defaults({ease: "none", duration: 1});
   * ```
   *
   * @param {TweenVars} [defaults]
   * @returns {TweenVars} Defaults object
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.defaults()
   */
  function defaults(defaults?: TweenVars): TweenVars;

  /**
   * Delays the call of a function by the specified amount.
   *
   * ```js
   * let delayTween = gsap.delayedCall(1, myFunc);
   * ```
   *
   * @param {number} delay
   * @param {Function} callback
   * @param {any[]} [params]
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.delayedCall()
   */
  function delayedCall(delay: number, callback: Function, params?: any[]): core.Tween;

  /**
   * Transfers all tweens, timelines, and (optionally) delayed calls from the root timeline into a new timeline.
   *
   * ```js
   * const exportedTL = gsap.exportRoot();
   * ```
   *
   * @param {TimelineVars} [vars]
   * @param {boolean} [includeDelayedCalls]
   * @returns {Timeline} Timeline instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.exportRoot()
   */
  function exportRoot(vars?: TimelineVars, includeDelayedCalls?: boolean): core.Timeline;

  /**
   * Creates a tween coming FROM the given values.
   *
   * ```js
   * gsap.from(".class", {x: 100});
   * ```
   *
   * @param {TweenTarget} targets
   * @param {TweenVars} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.from()
   */
  function from(targets: TweenTarget, vars: TweenVars): core.Tween;
  /**
   * **Deprecated method signature.** Use the `duration` property instead.
   * 
   * ```js
   * gsap.from(".class", 1, {x: 100});
   * ```
   * @deprecated since version 2
   * @param {TweenTarget} targets
   * @param {number} duration - The duration parameter is deprecated. Use the `duration` property instead.
   * @param {TweenVars} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.from()
   */
  function from(targets: TweenTarget, duration: number, vars:TweenVars): core.Tween;

   /**
   * Creates a tween coming FROM the first set of values going TO the second set of values.
   *
   * ```js
   * gsap.fromTo(".class", {x: 0}, {x: 100});
   * ```
   *
   * @param {TweenTarget} targets
   * @param {TweenVars} fromVars
   * @param {TweenVars} toVars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.fromTo()
   */
  function fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars): core.Tween;
  /**
   * **Deprecated method signature.** Use the `duration` property instead.
   * 
   * ```js
   * gsap.fromTo(".class", 1, {x: 0}, {x: 100});
   * ```
   * @deprecated since version 2
   * @param {TweenTarget} targets
   * @param {number} duration - The duration parameter is deprecated. Use the `duration` property instead.
   * @param {TweenVars} fromVars
   * @param {TweenVars} toVars
   * @returns {Tween} Tween instance
   * @link https://greensock.com/docs/v3/GSAP/gsap.fromTo()
   */
  function fromTo(targets: TweenTarget, duration: number, fromVars: TweenVars, toVars: TweenVars): core.Tween;

  /**
   * Gets the tween or timeline with the specified ID if it exists.
   *
   * ```js
   * gsap.to(obj, {id: "myTween", x: 100});
   * 
   * // later
   * let tween = gsap.getById("myTween");
   * ```
   *
   * @param {string | number} id
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.getById()
   */
  function getById<T extends core.Animation>(id: string | number): T;

  /**
   * Gets the specified property of the target (or first of the targets) if it exists.
   *
   * ```js
   * gsap.getProperty(element, "x");
   * ```
   *
   * @param {TweenTarget} target
   * @param {string} property
   * @param {string} [unit]
   * @returns {string | number} Value
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.getProperty()
   */
  function getProperty(target: TweenTarget, property: string, unit?: string): string | number;
  function getProperty(target: TweenTarget): (property: string, unit?: string) => string | number;

  /**
   * Gets all of the tweens whose targets include the specified target or group of targets.
   *
   * ```js
   * gsap.getTweensOf(element);
   * ```
   *
   * @param {TweenTarget} targets
   * @param {boolean} [onlyActive]
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.getTweensOf()
   */
  function getTweensOf(targets: TweenTarget, onlyActive?: boolean): core.Tween[];

  /**
   * Used to add all the GSAP globals to a particular tween object.
   *
   * ```js
   * gsap.install(myTween);
   * ```
   * 
   * @param {object} targets
   * @returns {gsap} The gsap object
   * @memberof gsap
   */
  function install(targets: object): typeof gsap;

  /**
   * Reports whether or not a particular object is actively animating.
   *
   * ```js
   * gsap.isTweening("#id");
   * ```
   * 
   * @param {TweenTarget} targets
   * @returns {boolean} Status
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.isTweening()
   */
  function isTweening(targets: TweenTarget): boolean;

  /**
   * Kills all the tweens (or specific tweening properties) of a particular object or the delayedCalls to a particular function.
   *
   * ```js
   * gsap.killTweensOf(".myClass");
   * gsap.killTweensOf(myObject, "opacity,x");
   * ```
   *
   * @param {TweenTarget} targets
   * @param {object | string} [properties]
   * @param {boolean} [onlyActive]
   * @returns {void} Void
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.killTweensOf()
   */
  function killTweensOf(targets: TweenTarget, properties?: object | string, onlyActive?: boolean): void;

  /**
   * Returns the corresponding easing function for the given easing string.
   *
   * ```js
   * let ease = gsap.parseEase("power1");
   * ```
   *
   * @param {string | EaseFunction} ease
   * @returns {EaseFunction} Ease function
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.parseEase()
   */
  function parseEase(ease: string | EaseFunction): EaseFunction;
  function parseEase(): EaseMap;

  /**
   * Returns a function that acts as a simpler alternative of gsap.set() that is more performant but less versatile.
   *
   * ```js
   * const setX = gsap.quickSetter("#id", "x", "px");
   * 
   * // later
   * setX(100);
   * ```
   *
   * @param {TweenTarget} targets
   * @param {string} property
   * @param {string} [unit]
   * @returns {Function} Setter function
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.quickSetter()
   */
  function quickSetter(targets: TweenTarget, property: string, unit?: string): Function;

  /**
   * Register custom easing functions with GSAP, giving it a name so it can be referenced in any tweens.
   *
   * ```js
   * gsap.registerEase("myEaseName", function(progress) {
   *   return progress; //linear
   * });
   * ```
   *
   * @param {string} name
   * @param {EaseFunction} ease
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.registerEase()
   */
  function registerEase(name: string, ease: EaseFunction): void;

  // TODO: Create interface for effect
  /**
   * Registers custom effects (named tweens) for reuse with optional arguments.
   *
   * ```js
   * // register the effect with GSAP:
   * gsap.registerEffect({
   *   name: "fade",
   *   effect: (targets, config) => {
   *     return gsap.to(targets, {duration: config.duration, opacity: 0});
   *   },
   *   defaults: {duration: 2}, //defaults get applied to any "config" object passed to the effect
   *   extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
   * });
   *
   * // now we can use it like this:
   * gsap.effects.fade(".box");
   * // or
   * tl.fade(".box", {duration: 3})
   * ```
   *
   * @param {object} effect
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.registerEffect()
   */
  function registerEffect(effect: object): void;
  
  /**
   * Installs the specified GSAP plugins, provided they have been loaded already.
   * 
   * ```js
   * gsap.registerPlugin(MorphSVPlugin, MotionPathPlugin);
   * ```
   *
   * @param {RegisterablePlugins[]} args
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.registerPlugin()
   */
  function registerPlugin(...args: RegisterablePlugins[]): void;
  
  /**
   * Immediately sets properties of the target(s) to the properties specified.
   *
   * ```js
   * gsap.set(".class", {x: 100, y: 50, opacity: 0});
   * ```
   *
   * @param {TweenTarget} targets
   * @param {TweenVars} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.set()
   */
  function set(targets: TweenTarget, vars: TweenVars): core.Tween;

  /**
   * Creates a new timeline, used to compose sequences of tweens.
   *
   * @param {TimelineVars} [vars]
   * @returns {Timeline} Timeline instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.timeline()
   */
  function timeline(vars?: TimelineVars): core.Timeline;

  /**
   * Creates a tween going TO the given values.
   *
   * ```js
   * gsap.to(".class", {x: 100});
   * ```
   *
   * @param {TweenTarget} targets
   * @param {TweenVars} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.to()
   */
  function to(targets: TweenTarget, vars: TweenVars): core.Tween;
  /**
   * **Deprecated method signature.** Use the `duration` property instead.
   * 
   * ```js
   * gsap.to(".class", 1, {x: 100});
   * ```
   * @deprecated since version 2
   * @param {TweenTarget} targets
   * @param {number} duration - The duration parameter is deprecated. Use the `duration` property instead.
   * @param {TweenVars} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.to()
   */
  function to(targets: TweenTarget, duration: number, vars: TweenVars): core.Tween;

  /**
   * Manually update the root (global) timeline. Make sure to unhook GSAP's default ticker.
   *
   * ```js
   * // unhooks the GSAP ticker
   * gsap.ticker.remove(gsap.updateRoot);
   * 
   * // sets the root time to 20 seconds manually
   * gsap.updateRoot(20);
   * ```
   *
   * @param {number} number
   * @returns {void} Void
   * @memberof gsap
   * @link https://greensock.com/docs/v3/GSAP/gsap.updateRoot()
   */
  function updateRoot(time: number): void;

  
}

// TODO: Move to files where declared
declare class TweenLite extends gsap.core.Tween {}
declare class TweenMax extends gsap.core.Tween {}
declare class TimelineLite extends gsap.core.Timeline {}
declare class TimelineMax extends gsap.core.Timeline {}

declare module "gsap/gsap-core" {

  const _gsap: typeof gsap;  

  // TODO: Move to files where declared
  export class TweenLite extends gsap.core.Tween {}
  export class TweenMax extends gsap.core.Tween {}
  export class TimelineLite extends gsap.core.Timeline {}
  export class TimelineMax extends gsap.core.Timeline {}

  export {
    _gsap as gsap,
    _gsap as default
  }
}

declare module "gsap/src/gsap-core" {
  export * from "gsap/gsap-core";
  export { gsap as default } from "gsap/gsap-core";
}
