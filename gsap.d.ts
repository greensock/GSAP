// Type definitions for GSAP v3.0
// Project: https://github.com/greensock/GSAP
// Definitions by:
// Blake Bowen <https://github.com/OSUblake>
// Pedro Tavares <https://github.com/dipscom>
// Zach Saucier <https://github.com/ZachSaucier>

interface arrayType {
  length: number
}



declare namespace GSAPStatic {
  /* 
    type easeStrings = 'power0.none'
    | 'power1.in'
    | 'power1.out'
    | 'power1.inOut'
    | 'power1.inOut'
    | 'power2.out'
    | 'power2.inOut'
    | 'power2.inOut'
    | 'power3.out'
    | 'power3.inOut'
    | 'power3.inOut'
    | 'power4.out'
    | 'power4.inOut'
    | 'power4.inOut'
    | 'back.out'
    | 'back.inOut'
    | 'back.inOut'
    | 'elastic.out'
    | 'elastic.inOut'
    | 'elastic.inOut'
    | 'bounce.out'
    | 'bounce.inOut'
    | 'bounce.inOut'
    | 'rough ({ template: string, strength: number, points: number, taper: none|in|out|both, randomize: boolean, clamp: boolean })' /* Not in GSAP core || TODO: this has a config string object *-/
    | 'slow (linearRatio: number, power: number, yoyoMode: boolean)' /* Not in GSAP core || TODO: this has a config string object *-/
    | `steps (numSteps: number)` /* TODO: this has a config string object *-/
    | `custom (numSteps)` /* Not in GSAP core || TODO: this has a config string object *-/
    | 'circ.out'
    | 'circ.inOut'
    | 'circ.inOut'
    | 'expo.out' /* Not in GSAP core *-/
    | 'expo.inOut' /* Not in GSAP core *-/
    | 'expo.inOut' /* Not in GSAP core *-/
    | 'sine.out'
    | 'sine.inOut'
    | 'sine.inOut'
  */

  type attrPlugin = {};
  type cssPlugin = {};
  // continue from here
  type modifiersPlugin = {
    [key: string]: (value: number | string, target?: object) => number | string;
  }

  type obj2D = { x: number, y: number };
  type callbackFn = (...args: any) => any;
  type callbackType = 'onComplete' | 'onUpdate' | 'onStart' | 'onReverseComplete' | 'onRepeat';
  type positionType = number | string;
  type validTargets = string | object | string[] | object[];
  type tweenVars = {
    attr?: attrPlugin;
    css?: cssPlugin;
    data?: object;
    delay?: number;
    duration?: number;
    ease?: string | object;
    id?: string;
    immediateRender?: boolean;
    inherit?: boolean;
    keyframes?: object; // TODO review this object as it might need extra properties, like 'duration', definitions
    lazy?: boolean;
    modifiers?: modifiersPlugin;
    onComplete?: callbackFn;
    onCompleteParams?: any[];
    onInterrupt?: callbackFn;
    onInterruptParams?: any[];
    onRepeat?: callbackFn;
    onRepeatParams?: any[];
    onReverseComplete?: callbackFn;
    onReverseCompleteParams?: any[];
    onStart?: callbackFn;
    onStartParams?: any[];
    onUpdate?: callbackFn;
    onUpdateParams?: any[];
    overwrite?: 'auto' | boolean;
    paused?: boolean;
    repeat?: number;
    repeatDelay?: number;
    repeatRefresh?: boolean;
    reversed?: boolean;
    runBackwards?: boolean;
    stagger?: number | object | callbackFn; // TODO list the object option properties and the function option
    startAt?: object;
    yoyo?: boolean;
    yoyoEase?: string // TODO is this the same as the ease property?
    [key: string]: any; // so TypeScript does not prevent the user from adding their own properties
  }
  
  /**
   * Base class for Tween and Timeline classes.
   *
   * @class Animation
   */
  class Animation {

    /**
		 * A place to store any data you want (initially populated with vars.data if it exists)
		 *
		 * @member {Animation}
		 * @default undefined
		 */
    data: object;




    /**
     * Creates an instance of Animation.
     *
     * @param {object} vars
     * @param {number} [time]
     * @memberof Animation
     */
    constructor(vars?: object, time?: number);





    /**
     * Sets the animation's initial delay which is the length of time in seconds before the animation should begin.
     *
     * @param {number} value - Delay value
     * @returns {this} Returns self, useful for chaining.
     * @memberof Animation
     */
    delay(value: number): this;

    /**
     * Gets the animation's initial delay which is the length of time in seconds before the animation should begin.
     *
     * @returns {number} The progress value
     * @memberof Animation
     */
    delay(): number;





    /**
     * Adjusts the animation's timeScale to fit it within the specified duration.
     *
     * @param {number} value - Duration value
     * @returns {this} Returns self, useful for chaining.
     * @memberof Animation
     */
    duration(value: number): this;

    /**
     * Gets the animation's duration.
     *
     * @returns {number}
     * @memberof Animation
     */
    duration(): number;





    endTime(includeRepeats?: boolean): number;



    eventCallback(type: callbackType, callback: callbackFn, params?: any[], scope?: object): this;

    eventCallback(type: callbackType): callbackFn;




    invalidate(): this;




    isActive(): boolean;




    iteration(value: number, supressEvents?: boolean): this;

    iteration(): number;




    kill(vars?: object, targets?: object | object[] ): this;




    pause(atTime?: number, supressEvents?: boolean): this;




    paused(value: boolean): this;

    paused(): boolean;




    play(from?: number, supressEvents?: boolean): this;




    /**
     * Sets the animation's progress which is a value between 0 and 1 indicating the position of the virtual
     * playhead (excluding repeats) where 0 is at the beginning, 0.5 is halfway complete, and 1 is complete.
     *
     * @param {number} value - Progress value
     * @param {boolean} [supressEvents=false] - (default = false) If true, no events or callbacks will be triggered when the playhead moves to the new position.
     * @returns {this} Returns self, useful for chaining.
     * @memberof Animation
     */
    progress(value: number, supressEvents?: boolean): this;

    /**
     * Gets the animation's progress which is a value between 0 and 1 indicating the position of the virtual
     * playhead (excluding repeats) where 0 is at the beginning, 0.5 is halfway complete, and 1 is complete.
     *
     * @returns {number} The progress value
     * @memberof Animation
     */
    progress(): number;




    rawTime(wrapRepeats: boolean): number;




    repeat(value: number): this;

    repeat(): number;




    repeatDelay(value: number): this

    repeatDelay(): number;




    restart(includeDelay?: boolean, supressEvents?: boolean): this;




    resume(from?: number, supressEvents?: boolean): this;




    reverse(from?: number, supressEvents?: boolean): this;




    reversed(value: boolean): this;

    reversed(): boolean




    startTime(value: number): this;

    startTime(): number;



    seek(time: number, supressEvents?: boolean): this;




    then(callback: callbackFn): Promise<any>;




    time(value: number, supressEvents?: boolean): this;

    time(): number;




    timeScale(value: number): this;

    timeScale(): number;




    totalDuration(value: number): this;

    totalDuration(): number;




    totalProgress(value: number, supressEvents?: boolean): this;

    totalProgress(): number;




    totalTime(value: number, supressEvents?: boolean): this;

    totalTime(): number;


    yoyo(value: boolean): this

    yoyo(): boolean;
  }










  /**
   * Tween description
   *
   * @class Tween
   * @extends {Animation}
   */
  class Tween extends Animation {


    data: object;

		/**
		 * The vars object passed into the constructor
		 *
		 * @member {Tween}
		 * @default {duration: 0.5, overwrite: false, delay: 0, ease: "power2.out"}
		 */
    vars: object;




    static to(targets: validTargets, duration: number, vars: tweenVars): Tween;

    /**
     * Creates a Tween animating to destination values that are set.
     *
     * @static
     * @returns {Tween}
     * @memberof Tween
     */
    static to(targets: validTargets, vars: tweenVars): Tween;




    static from(targets: validTargets, duration: number, vars: tweenVars): Tween;

    static from(targets: validTargets, vars: tweenVars): Tween;




    static fromTo(targets: validTargets, duration: number, fromVars: tweenVars, toVars: tweenVars): Tween;

    static fromTo(targets: validTargets, fromVars: tweenVars, toVars: tweenVars): Tween;
  }











  /**
   * Timelines are essentially chains of tweens (.to, from, fromTo, etc.) calls. They are the ultimate
	 * sequencing tool that acts like a container for tweens and other timelines, making it simple to control
	 * them as a whole and precisely manage their timing.
   *
   * @class Timeline
   * @extends {Animation}
   */
  class Timeline extends Animation {

		/**
		 * If true, child tweens and timelines will be removed as soon as they complete
		 *
		 * @member {Timeline}
		 * @default false, except on the root timeline(s)
		 */
    autoRemoveChildren: boolean;




    data: object;




		/**
		 * Stores any labels that have been added to the timeline.
		 *
		 * @member {Timeline}
		 * @default {}
		 */
		labels: object;




		/**
		 * Controls whether or not child tweens and timelines are repositioned automatically (changing their startTime) in order to maintain smooth playback when properties are changed on-the-fly.
		 *
		 * @member {Timeline}
		 * @default false, except on the root timeline(s)
		 */
		smoothChildTiming: boolean;




		/**
	   * Adds a tween, timeline, callback, or label (or an array of them) to the timeline.
     * TODO: missing function() value param
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		add(value: Tween | Timeline | string | string[], position?: positionType, align?: string, stagger?: number | string): this;




		/**
	   * Adds a label to the timeline, making it easy to mark important positions/times.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		addLabel(label: string, position?: positionType): this;




		/**
	   * Inserts a special callback that pauses playback of the timeline at a particular time or label.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
    addPause(position?: positionType, callback?: callbackFn, params?: any[]): this;




    call(callback: callbackFn, params?: any[], position?: positionType): this;




    clear(labels: boolean): this;




    currentLabel(value: string): this;

    currentLabel(): string;




    from(targets: validTargets, duration: number, vars: tweenVars, position?: positionType): this;

    from(targets: validTargets, vars: tweenVars, position?: positionType): this;




    fromTo(targets: validTargets, duration: number, fromVars: tweenVars, toVars: tweenVars, position?: positionType): this;

    fromTo(targets: validTargets, fromVars: tweenVars, toVars: tweenVars, position?: positionType): this;




    getChildren(nested?: boolean, tweens?: boolean, timelines?: boolean, ignoreBeforeTime?: number): object[]; // This should be an array of Tweens AND Timelines




    getTweensOf(target: object, nested?: boolean): Tween[];




    nextLabel(time?: number): string;




    previousLabel(time?: number): string;




    recent(): Tween | Timeline | callbackFn;




    remove(value: Tween | Timeline | callbackFn | string): this;




    removeLabel(label: string): number;




    removePause(position: positionType): this




    set(target: validTargets, vars: tweenVars, position?: positionType): this;



    shiftChildren(amount: number, adjustLabels?:boolean, ignoreBeforeTime?: number): this;




	  /**
	   * Creates a Tween animating to destination values that are set.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
    to(targets: validTargets, duration: number, vars: tweenVars, position?: positionType): this;

    to(targets: validTargets, vars: tweenVars, position?: positionType): this;




    tweenFromTo(fromPosition: positionType, toPosition: positionType, vars: tweenVars): this;




    tweenTo(position: positionType, vars: tweenVars): this;
  }










  interface gsap {

    effects: object;




    globalTimeline: Timeline;




    ticker: {
      add(callback: callbackFn): void;
      fps(fps: number): void;
      frame: number;
      lagSmoothing(threshold: number, adjustedLag: number): void;
      remove(callback: callbackFn): void;
      sleep(): void;
      tick(): void;
      time: number;
      wake(): void;
    };




    utils: {
      checkPrefix(value: string): string;
      clamp(min: number, max: number, value: number): number;
      clamp(min: number, max: number): (value: number) => number;
      distribute(config: {
        base: number,
        amount: number,
        from: number | string | any[],
        grid: 'auto' | [number, number],
        axis: 'x' | 'y',
        ease: string // TODO: ease declaration
      }): callbackFn;
      getUnit(value: string): string;
      interpolate<T>(min: T, max: T, progress: number): T;
      interpolate<T>(min: T, max: T): (progress: number) => T;
      interpolate<T>(array: T[]): (progress: number) => T;
      mapRange(inMin: number, inMax: number, outMin: number, outMax: number, value: number): number;
      mapRange(inMin: number, inMax: number, outMin: number, outMax: number): (value: number) => number;
      normalize(inMin: number, inMax: number, value: number): number;
      normalize(inMin: number, inMax: number): (value: number) => number;
      random<T extends arrayType>(values1: T, values2?: null, progress?: number): T; // this is not working, when array, values2 should not be provided or has to be null
      random<T>(values1: T, values2: T, progress?: number, returnFunction?: boolean): () => T;
      random<T>(values1: T, values2: T, progress?: number): T;
      snap(snap: {values: obj2D[], radius: number}, value: obj2D): obj2D
      snap(snap: {values: number[], radius: number}, value: number): number
      snap(snap: obj2D[], value: obj2D): obj2D;
      snap(snap: number | number[], value: number): number;
      snap(snap: number | number[] | obj2D[]): callbackFn;
      snap(snap: {values: obj2D[], radius: number}): callbackFn;
      snap(snap: {values: number[], radius: number}): callbackFn;
      splitColor(color: string, hsl?: boolean): [number, number, number] | [number, number, number, number];
      toArray(value: string | object | NodeList, leaveStrings?: boolean): any[];
      unitize(fn: callbackFn, unit: string): string;
      wrap(value1: number, value2: number, index?: number): number;
      wrap(value1: number[] | string[] | object[], index?: number): number;
      wrap(value1: number[] | string[] | object[]): callbackFn;
      wrapYoyo(value1: number, value2: number, index?: number): number;
      wrapYoyo(value1: number[] | string[] | object[], index?: number): number;
      wrapYoyo(value1: number[] | string[] | object[]): callbackFn;
    }




    version: string;




    /**
     * gsap.config() lets you configure GSAP’s settings that aren't Tween-specific, like autoSleep, force3D, and units.
     *
     * @param {} value
     * @returns {gsap}
     * @memberof gsap
     */
    config(value: {
      autoSleep?: number;
      force3D?: boolean | 'auto';
      units?: { }; // TODO: need to be able to specify key/value pair type here  
    }): object;



    defaults(value: object): object;




    delayedCall(delay: number, callback: callbackFn, params?: string[], scope?: any): Tween; // TODO: investigate scope, try to eliminate 'any'




    exportRoot(vars?: tweenVars, includeDelayedCalls?: boolean): Timeline;




    from(targets: validTargets, vars: tweenVars): Tween;

    from(targets: validTargets, duration: number, vars:tweenVars): Tween;




    fromTo(targets: validTargets, fromVars: tweenVars, toVars: tweenVars): Tween;

    fromTo(targets: validTargets, duration: number, fromVars: tweenVars, toVars: tweenVars): Tween;




    getById(id: string): Tween | Timeline | undefined;




    getProperty(target: validTargets, property: string, unit?: string): string | number | null;




    getTweensOf(targets: object | object[], onlyActive?: boolean): Tween[];




    isTweening(): Boolean;




    killTweensOf(targets: validTargets, properties?: object): void;

    killTweensOf(delayedCallback: callbackFn): void;




    parseEase(ease: string): void;




    registerEase(config: { name: string, ease: callbackFn }): void




    // registerEffect()




    // registerPlugin()




    set(targets: validTargets, vars: tweenVars): Tween;




    /**
     *
     *
     * @param {object} [vars]
     * @returns {Timeline} Timeline instance
     * @memberof gsap
     */
    timeline(vars?: tweenVars): Timeline;




    /**
    * **Deprecated method signature.** Use the `duration` property instead.
    * ```js
    * tl.to(".class", { duration: 1, x: 100 });
    * ```
    * @deprecated since version 2
    * @param {*} targets
    * @param {number} duration - The duration parameter is deprecated. Use the `duration`
    * property instead.
    * @param {tweenVars} vars
    */
    to(targets: validTargets, duration: number, vars: tweenVars): Tween;

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
    to(targets: validTargets, vars: tweenVars): Tween;




    updateRoot(time: number): void;
  }

  const gsap: gsap;
}










declare const gsap: GSAPStatic.gsap;
declare const TweenLite: typeof GSAPStatic.Tween;
declare const TweenMax: typeof GSAPStatic.Tween;
declare const TimelineLite: typeof GSAPStatic.Timeline;
declare const TimelineMax: typeof GSAPStatic.Timeline;

declare module "gsap" {

  const gsap: GSAPStatic.gsap;
  const TweenLite: typeof GSAPStatic.Tween;
  const TweenMax: typeof GSAPStatic.Tween;
  const TimelineLite: typeof GSAPStatic.Timeline;
  const TimelineMax: typeof GSAPStatic.Timeline;

  export {
    gsap,
    gsap as default,
    TweenLite,
    TweenMax,
    TimelineLite,
    TimelineMax
  }
}
