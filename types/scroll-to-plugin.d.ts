declare namespace ScrollToPlugin {
  interface Vars {
    x?: number | string | Element;
    y?: number | string | Element;
    offsetX?: number;
    offsetY?: number;
    autoKill?: boolean;
    onAutoKill?: Function;
  }
}

declare namespace gsap {

  interface TweenVars {
    scrollTo?: number | string | Element | Function | ScrollToPlugin.Vars;
  }
}

declare namespace gsap.plugins {
  interface ScrollToPlugin extends Plugin {
     
  }

  interface ScrollToPluginClass extends ScrollToPlugin {
    new(): PluginScope & ScrollToPlugin;
    prototype: PluginScope & ScrollToPlugin;
  }

  const scrollTo: ScrollToPluginClass;
}

declare const ScrollToPlugin: gsap.plugins.ScrollToPlugin;

declare module "gsap/ScrollToPlugin" {
  export const ScrollToPlugin: gsap.plugins.ScrollToPlugin;
  export { ScrollToPlugin as default };
}

declare module "gsap/src/ScrollToPlugin" {
  export * from "gsap/ScrollToPlugin";
  export { ScrollToPlugin as default } from "gsap/ScrollToPlugin";
}

declare module "gsap/dist/ScrollToPlugin" {
  export * from "gsap/ScrollToPlugin";
  export { ScrollToPlugin as default } from "gsap/ScrollToPlugin";
}

declare module "gsap/all" {
  export * from "gsap/ScrollToPlugin";
}