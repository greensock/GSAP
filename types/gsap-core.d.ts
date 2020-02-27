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
    | object;

  // querySelector returns type Element | null
  type DOMTarget = Element | string | null | ArrayLike<Element | string | null>;
  type TweenTarget = string | object | null; 

  type Callback = (...args: any[]) => void;
  type CallbackType = "onComplete" | "onInterrupt" | "onRepeat" | "onReverseComplete" | "onStart" | "onUpdate";
  type TickerCallback = (time: number, deltaTime: number, frame: number, elapsed: number) => void;

  type Point2D = { x: number, y: number };
  type Position = number | string;
  
  type FunctionBasedValue<T> = (index: number, target: any, targets: any[]) => T;
  type ArrayValue = any[] | FunctionBasedValue<any[]>;
  type BooleanValue = boolean | FunctionBasedValue<boolean>;
  type NumberValue = number | FunctionBasedValue<number>;
  type StringValue = string | FunctionBasedValue<string>;
  type TweenValue = NumberValue | StringValue;

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

  function config(config: GSAPConfig): GSAPConfig;
  function config(): GSAPConfig;

  function defaults(defauts: TweenVars): TweenVars;
  function defaults(): TweenVars;

  function delayedCall(delay: number, callback: Callback, params?: any[], scope?: object): core.Tween; 

  function exportRoot(vars?: TimelineVars, includeDelayedCalls?: boolean): core.Timeline;

  function from(targets: TweenTarget, vars: TweenVars): core.Tween;
  function from(targets: TweenTarget, duration: number, vars:TweenVars): core.Tween;

  function fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars): core.Tween;
  function fromTo(targets: TweenTarget, duration: number, fromVars: TweenVars, toVars: TweenVars): core.Tween;

  function getById<T extends core.Animation>(id: string | number): T;

  function getProperty(targets: TweenTarget, property: string, unit?: string): string | number;
  function getProperty(targets: TweenTarget): (property: string, unit?: string) => string | number;

  function getTweensOf(targets: TweenTarget, onlyActive?: boolean): core.Tween[];

  function install(targets: object): typeof gsap;

  function isTweening(targets: TweenTarget): boolean;

  function killTweensOf(targets: TweenTarget, properties?: object | string, onlyActive?: boolean): void;

  function parseEase(ease: string | EaseFunction): EaseFunction;
  function parseEase(): EaseMap;
  
  function quickSetter(target: TweenTarget, property: string, unit?: string): (value: any) => void;

  function registerEase(config: { name: string, ease: EaseFunction }): void;

  // TODO: Create interface for effect
  function registerEffect(effect: object): void;

  function registerPlugin(...args: RegisterablePlugins[]): void;

  function set(targets: TweenTarget, vars: TweenVars): core.Tween;

  /**
   *
   *
   * @param {object} [vars]
   * @returns {Timeline} Timeline instance
   * @memberof gsap
   */
  function timeline(vars?: TimelineVars): core.Timeline;

  /**
   * Creates an animation
   *
   * ```js
   *  var tween = gsap.to(".class", { x: 100 });
   * ```
   *
   * @param {*} targets
   * @param {object} vars
   * @returns {Tween} Tween instance
   * @memberof gsap
   */
  function to(targets: TweenTarget, vars: TweenVars): core.Tween;

  /**
  * **Deprecated method signature.** Use the `duration` property instead.
  * ```js
  * tl.to(".class", { duration: 1, x: 100 });
  * ```
  * @deprecated since version 2
  * @param {*} targets
  * @param {number} duration - The duration parameter is deprecated. Use the `duration`
  * property instead.
  * @param {TweenVars} vars
  */
  function to(targets: TweenTarget, duration: number, vars: TweenVars): core.Tween;

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
