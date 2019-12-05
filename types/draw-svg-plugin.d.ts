declare namespace gsap {

  interface TweenVars {
    drawSVG?: BooleanValue | TweenValue;
  }
}

declare namespace gsap.plugins {

  interface DrawSVGPlugin extends Plugin {
    getLength(element: DOMTarget): number;
    getPosition(element: DOMTarget): number;
  }

  interface DrawSVGPluginClass extends DrawSVGPlugin {
    new(): PluginScope & DrawSVGPlugin;
    prototype: PluginScope & DrawSVGPlugin;
  }

  const drawSVG: DrawSVGPluginClass;
}

declare const DrawSVGPlugin: gsap.plugins.DrawSVGPlugin;

declare module "gsap/DrawSVGPlugin" {
  export const DrawSVGPlugin: gsap.plugins.DrawSVGPlugin;
  export { DrawSVGPlugin as default };
}

declare module "gsap/src/DrawSVGPlugin" {
  export * from "gsap/DrawSVGPlugin";
  export { DrawSVGPlugin as default } from "gsap/DrawSVGPlugin";
}

declare module "gsap/dist/DrawSVGPlugin" {
  export * from "gsap/DrawSVGPlugin";
  export { DrawSVGPlugin as default } from "gsap/DrawSVGPlugin";
}

declare module "gsap/all" {
  export * from "gsap/DrawSVGPlugin";
}
