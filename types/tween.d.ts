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

    kill(target?: object, propertiesList?: string): this;
    targets<T>(): T[];
  }
}
