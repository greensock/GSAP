declare namespace gsap.core {

  class Tween extends Animation {
    
    data: any;
    vars: TweenVars;

    constructor(targets: TweenTarget, vars: TweenVars, time?: number);
    constructor(targets: TweenTarget, duration: number, vars: TweenVars);
    
    static to(targets: TweenTarget, duration: number, vars: TweenVars): Tween;
    static to(targets: TweenTarget, vars: TweenVars): Tween;
    static from(targets: TweenTarget, duration: number, vars: TweenVars): Tween;
    static from(targets: TweenTarget, vars: TweenVars): Tween;
    static fromTo(targets: TweenTarget, duration: number, fromVars: TweenVars, toVars: TweenVars): Tween;
    static fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars): Tween;

    /**
     * Kills the parts of the tween specified. 
     * To kill means to immediately stop the tween, remove it from its parent timeline, and release it for garbage collection.
     *
     * ```js
     * // kills the entire tween
     * tween.kill(); 
     * 
     * // kill all parts of the tween related to the target "myObject" (if the tween has multiple targets, the others will not be affected):
     * tween.kill(myObject);
     * 
     * // kill only the "x" and "y" properties of the tween (all targets):
     * tween.kill(null, "x,y");
     * 
     * // kill only the "x" and "y" properties of tween of the target "myObject":
     * tween.kill(myObject, "x,y");
     * 
     * // kill only the "opacity" properties of the tween of the targets "myObject1" and "myObject2":
     * tween.kill([myObject1, myObject2], "opacity");
     * ```
     *
     * @returns {Tween} The tween
     * @memberof Tween
     */
    kill(target?: object, propertiesList?: string): this;

    /**
     * Returns an array of all of the tween's targets.
     *
     * ```js
     * tween.targets(); 
     * ```
     *
     * @returns {T[]} The array of targets
     * @memberof Tween
     */
    targets<T>(): T[];
  }
}
