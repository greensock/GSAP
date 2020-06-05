declare namespace gsap.core {

  // Added to TypeScript 3.5
  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

  class Animation {

    static readonly version: string;

    data: any;
    readonly parent: Timeline | null;

    constructor(vars?: object, time?: number);

    /**
     * Sets the delay before the start of the animation.
     *
     * ```js
     * anim.delay(1);
     * ```
     *
     * @param {number} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    delay(value: number): this;
    /**
     * Gets the delay before the start of the animation.
     *
     * ```js
     * anim.delay();
     * ```
     *
     * @returns {number} The delay value
     * @memberof Animation
     */
    delay(): number;

    /**
     * Sets the duration of the animation.
     *
     * ```js
     * anim.duration(1);
     * ```
     *
     * @param {number} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    duration(value: number): this;
    /**
     * Gets the duration of the animation.
     *
     * ```js
     * anim.duration();
     * ```
     *
     * @returns {number} The duration
     * @memberof Animation
     */
    duration(): number;

    /**
     * Returns the time at which the animation will finish according to the parent timeline's local time.
     *
     * ```js
     * anim.endTime() // the time, e.g. something like 17.854
     * ```
     *
     * @returns {number} The end time
     * @memberof Animation
     */
    endTime(includeRepeats?: boolean): number;

    /**
     * Sets a callback of the animation.
     *
     * ```js
     * anim.eventCallback("onComplete", myCompleteCallback);
     * ```
     *
     * @param {CallbackType} type
     * @param {Callback} callback
     * @param {any[]} [params]
     * @param {object} [scope]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    eventCallback(type: CallbackType, callback: Callback, params?: any[], scope?: object): this;
    /**
     * Gets the requested callback function of the animation.
     *
     * ```js
     * anim.eventCallback("onComplete"); // function or undefined
     * ```
     *
     * @param {CallbackType} type
     * @returns {Callback} The callback
     * @memberof Animation
     */
    eventCallback(type: CallbackType): Callback;

    /**
     * Forces new starting & ending values based on the current state.
     *
     * ```js
     * anim.invalidate();
     * ```
     *
     * @returns {Animation} The animation
     * @memberof Animation
     */
    invalidate(): this;

    /**
     * Returns true or false based on the active state of the animation.
     * Being active means that the virtual playhead is actively moving across this instance's time span and it is not paused, nor are any of its ancestor timelines.
     *
     * ```js
     * anim.isActive();
     * ```
     *
     * @returns {boolean} The active state
     * @memberof Animation
     */
    isActive(): boolean;

    /**
     * Sets the current iteration of the animation.
     *
     * ```js
     * anim.iteration(1); // set the state back to the start in this case
     * ```
     *
     * @param {number} value
     * @param {boolean} [supressEvents]
     * @returns {Animation} The tween
     * @memberof Animation
     */
    iteration(value: number, supressEvents?: boolean): this;
    /**
     * Gets the current iteration of the animation.
     *
     * ```js
     * anim.iteration();  // getter
     * ```
     *
     * @returns {number} The iteration
     * @memberof Animation
     */
    iteration(): number;

    /**
     * Kills the animation entirely. 
     * To kill means to immediately stop the animation, remove it from its parent timeline, and release it for garbage collection.
     *
     * ```js
     * anim.kill();
     * ```
     *
     * @returns {Animation} The animation
     * @memberof Animation
     */
    kill(): this;

    /**
     * Pauses the animation, optionally at the given time.
     *
     * ```js
     * anim.pause();    // pause immediately
     * anim.pause(1.5); // pause but seek to this time in the animation
     * ```
     *
     * @param {number} [atTime]
     * @param {number} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    pause(atTime?: number, supressEvents?: boolean): this;

    /**
     * Sets the paused state of the animation.
     *
     * ```js
     * anim.paused(true); // pause immediately
     * ```
     *
     * @param {boolean} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    paused(value: boolean): this;
    /**
     * Gets the paused state of the animation.
     *
     * ```js
     * anim.paused(); // returns true or false
     * ```
     *
     * @returns {boolean} The paused state
     * @memberof Animation
     */
    paused(): boolean;

    /**
     * Plays the animation, optionally from the given start time.
     *
     * ```js
     * anim.play(true); // play from current point
     * anim.play(1.5);  // play from the 1.5 second mark
     * ```
     *
     * @param {number} [from]
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    play(from?: number | string | null, supressEvents?: boolean): this;

    /**
     * Sets the progress of the animation (between 0 and 1).
     *
     * ```js
     * anim.progress(0.5); // go to the half way point
     * ```
     *
     * @param {number} value
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    progress(value: number, supressEvents?: boolean): this;
    /**
     * Gets the progress of the animation.
     *
     * ```js
     * anim.progress(); // returns the progress like 0.5
     * ```
     *
     * @returns {number} The progress
     * @memberof Animation
     */
    progress(): number;
    
    rawTime(wrapRepeats?: boolean): number;

    /**
     * Sets the number of repeats of the animation.
     *
     * ```js
     * anim.repeat(1); // sets repeat to 1 for a total iteration count of 2
     * ```
     *
     * @param {number} [value]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    repeat(value: number): this;
    /**
     * Gets the number of repeats of the animation.
     *
     * ```js
     * anim.repeat(); 
     * ```
     *
     * @returns {number} The repeat value
     * @memberof Animation
     */
    repeat(): number;

    /**
     * Sets the repeat delay (time between iterations) of the animation.
     *
     * ```js
     * anim.repeatDelay(1);
     * ```
     *
     * @param {number} [value]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    repeatDelay(value: number): this;
    /**
     * Gets the repeat delay (time between iterations) of the animation.
     *
     * ```js
     * anim.repeatDelay(); 
     * ```
     *
     * @returns {number} The repeatDelay value
     * @memberof Animation
     */
    repeatDelay(): number;

    /**
     * Begins playing the animation forward from the beginning, optionally including the starting delay.
     *
     * ```js
     * anim.restart();     // repeats the animation NOT including the starting delay
     * anim.restart(true); // repeats the animation including the starting delay
     * ```
     *
     * @param {number} [includeDelay]
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    restart(includeDelay?: boolean, supressEvents?: boolean): this;

    /**
     * Continues a paused animation in the direction it was headed (forwards or reverse), optionally from the given time.
     *
     * ```js
     * anim.resume();  // continues the animation
     * anim.resume(1); // continues the animation from the 1 second mark
     * ```
     *
     * @param {number} [from]
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    resume(from?: number | string | null, supressEvents?: boolean): this;

    /**
     * Plays an animation in the reverse direction, optionally from the given time.
     *
     * ```js
     * anim.reverse();  // plays the animation in reverse
     * anim.reverse(1); // plays the animation in reverse from the 1 second mark
     * ```
     *
     * @param {number} [from]
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    reverse(from?: number | string | null, supressEvents?: boolean): this;

    /**
     * Sets the reversed state of the animation.
     *
     * ```js
     * anim.reversed(true); // plays the animation in reverse
     * ```
     *
     * @param {boolean} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    reversed(value: boolean): this;
    /**
     * Gets the reversed state of the animation.
     *
     * ```js
     * anim.reversed(); // true or false
     * ```
     *
     * @returns {boolean} The reversed state
     * @memberof Animation
     */
    reversed(): boolean;

    /**
     * Sets the start time of the animation in reference to its parent timeline (not including any delay).
     *
     * ```js
     * anim.startTime(1); // plays the animation at the 1 second mark of the parent timeline
     * ```
     *
     * @param {number} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    startTime(value: number): this;
    /**
     * Gets the start time of the animation in reference to its parent timeline (not including any delay).
     *
     * ```js
     * anim.startTime(); // the current start time, something like 1.0
     * ```
     *
     * @returns {Animation} The animation
     * @memberof Animation
     */
    startTime(): number;

    /**
     * Sets the current time of the given animation using a time or a label.
     *
     * ```js
     * anim.seek(1); // moves the playhead to the 1 second mark
     * ```
     *
     * @param {number| string} time
     * @param {boolean} suppressEvents
     * @returns {Animation} The animation
     * @memberof Animation
     */
    seek(time: number | string, suppressEvents?: boolean): this;

    /**
     * Returns a promise for the given animation.
     *
     * ```js
     * anim.then(yourFunction).then(...);
     * ```
     *
     * @param {Function} [onFulfilled]
     * @returns {Promise} A promise for the completion of the animation
     * @memberof Animation
     */
    then(onFulfilled?: (result: Omit<this, "then">) => any): Promise<this>;

    /**
     * Sets the current time of the given animation.
     *
     * ```js
     * anim.time(1); // moves the playhead to the 1 second mark
     * ```
     *
     * @param {number} value
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    time(value: number, supressEvents?: boolean): this;
    /**
     * Gets the current time of the given animation.
     *
     * ```js
     * anim.time(); // the current time, e.g. something like 1.0
     * ```
     *
     * @returns {number} The current time
     * @memberof Animation
     */
    time(): number;

    /**
     * Sets the time scale of the given animation.
     *
     * ```js
     * anim.timeScale(2.0); // makes the animation go at twice the normal speed
     * ```
     *
     * @param {number} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    timeScale(value: number): this;
    /**
     * Gets the time scale of the given animation.
     *
     * ```js
     * anim.timeScale(); // the
     * ```
     *
     * @returns {Animation} The animation
     * @memberof Animation
     */
    timeScale(): number;

    /**
     * Sets the total duration (including repeats) of the given animation by time scaling the animation.
     *
     * ```js
     * anim.totalDuration(8); 
     * ```
     *
     * @param {number} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    totalDuration(value: number): this;
    /**
     * Gets the total duration (including repeats) of the given animation.
     *
     * ```js
     * anim.totalDuration(); // the total duration, e.g. something like 5.7
     * ```
     *
     * @returns {number} The total duration
     * @memberof Animation
     */
    totalDuration(): number;

    /**
     * Sets the total progress (including repeats) of the given animation.
     *
     * ```js
     * anim.totalProgress(0.5); // move the playhead to half way through the animation (including repeats)
     * ```
     *
     * @param {number} value
     * @param {boolean} suppressEvents
     * @returns {Animation} The animation
     * @memberof Animation
     */
    totalProgress(value: number, suppressEvents?: boolean): this;
    /**
     * Gets the total progress (including repeats) of the given animation.
     *
     * ```js
     * anim.totalProgress(); // the total progress, e.g. something like 0.5
     * ```
     *
     * @returns {number} The total progress
     * @memberof Animation
     */
    totalProgress(): number;

    /**
     * Sets the total time (meaning where the playhead is, including repeats) of the given animation.
     *
     * ```js
     * anim.totalTime(5.7); // move the playhead to the 5.7 mark of the animation (including repeats)
     * ```
     *
     * @param {number} value
     * @param {boolean} [supressEvents]
     * @returns {Animation} The animation
     * @memberof Animation
     */
    totalTime(value: number, supressEvents?: boolean): this;
    /**
     * Gets the total time (meaning where the playhead is, including repeats) of the given animation.
     *
     * ```js
     * anim.totalTime(); // the total time, e.g. something like 5.7
     * ```
     *
     * @returns {number} The total time
     * @memberof Animation
     */
    totalTime(): number;

    /**
     * Sets the yoyo value of the given animation.
     * Setting yoyo to true means that each time the animation repeats it should switch its direction (forwards or reverse).
     *
     * ```js
     * anim.yoyo(true); 
     * ```
     *
     * @param {boolean} value
     * @returns {Animation} The animation
     * @memberof Animation
     */
    yoyo(value: boolean): this;
    /**
     * Gets the yoyo value of the given animation.
     * If yoyo is true that means that each time the animation repeats it should switch its direction (forwards or reverse).
     *
     * ```js
     * anim.yoyo(); // true or false
     * ```
     *
     * @returns {boolean} The yoyo value
     * @memberof Animation
     */
    yoyo(): boolean;
  }
}
