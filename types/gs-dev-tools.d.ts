declare class GSDevTools {

  constructor(target: gsap.DOMTarget, vars?: GSDevTools.Vars);

  /**
   * Create a GSDevTools instance.
   * 
   * ```js
   * GSDevTools.create(".myClass");
   * ```
   *
   * @param {GSDevTools.Vars} vars
   * @returns {GSDevTools} The GSDevTools instance
   * @memberof GSDevTools
   * @link https://greensock.com/docs/v3/Plugins/GSDevTools/static.create()
   */
  static create(vars?: GSDevTools.Vars): GSDevTools;
}

declare namespace GSDevTools {
  interface Vars {
    [key: string]: any;
    animation?: string | gsap.core.Animation;
    container?: string | Element;
    css?: object | string;
    globalSync?: boolean;
    hideGlobalTimeline?: boolean;
    id?: string;
    inTime?: number | string;
    keyboard?: boolean;
    loop?: boolean;
    minimal?: boolean;
    outTime?: number | string;
    paused?: boolean;
    persist?: boolean;
    timeScale?: number;
    visibility?: string;
  }
}

declare module "gsap/GSDevTools" {
  class _GSDevTools extends GSDevTools {}
  export {
    _GSDevTools as GSDevTools,
    _GSDevTools as default
  }
}

declare module "gsap/src/GSDevTools" {
  export * from "gsap/GSDevTools";
  export { GSDevTools as default } from "gsap/GSDevTools";
}

declare module "gsap/dist/GSDevTools" {
  export * from "gsap/GSDevTools";
  export { GSDevTools as default } from "gsap/GSDevTools";
}

declare module "gsap/all" {
  export * from "gsap/GSDevTools";
}
