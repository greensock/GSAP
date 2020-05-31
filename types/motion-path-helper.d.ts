declare class MotionPathHelper {

  constructor(target: gsap.DOMTarget, vars?: MotionPathHelper.Vars);

  /**
   * Create a MotionPathHelper instance.
   * 
   * ```js
   * MotionPathHelper.create(".myClass");
   * ```
   *
   * @param {gsap.DOMTarget} target
   * @param {MotionPathHelper.Vars} [vars]
   * @returns {MotionPathHelper} The MotionPathHelper instance
   * @memberof MotionPathHelper
   */
  static create(target: gsap.DOMTarget, vars?: MotionPathHelper.Vars): MotionPathHelper;
}

declare namespace MotionPathHelper {
  interface Vars {
    [key: string]: any;
    ease?: string | gsap.EaseFunction;
    end?: number;
    duration?: number;
    path?: gsap.DOMTarget;
    pathColor?: gsap.TweenValue;
    pathWidth?: number;
    pathOpacity?: number;
    selected?: boolean;
    start?: number;
  }
}

declare module "gsap/MotionPathHelper" {
  class _MotionPathHelper extends MotionPathHelper {}
  export {
    _MotionPathHelper as MotionPathHelper,
    _MotionPathHelper as default
  }
}

declare module "gsap/src/MotionPathHelper" {
  export * from "gsap/MotionPathHelper";
  export { MotionPathHelper as default } from "gsap/MotionPathHelper";
}

declare module "gsap/dist/MotionPathHelper" {
  export * from "gsap/MotionPathHelper";
  export { MotionPathHelper as default } from "gsap/MotionPathHelper";
}

declare module "gsap/all" {
  export * from "gsap/MotionPathHelper";
}
