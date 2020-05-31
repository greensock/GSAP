declare namespace TextPlugin {
  interface Vars {
    value: string;
    type?: string;
    speed?: number;
    delimiter?: string;
    padSpace?: boolean;
    newClass?: string;
    oldClass?: string;
  }
}

declare namespace gsap {

  interface TweenVars {
    text?: string | TextPlugin.Vars;
  }
}

declare namespace gsap.plugins {
  interface TextPlugin extends Plugin {
     
  }

  interface TextPluginClass extends TextPlugin {
    new(): PluginScope & TextPlugin;
    prototype: PluginScope & TextPlugin;
  }

  const text: TextPluginClass;
}

declare const TextPlugin: gsap.plugins.TextPlugin;

declare module "gsap/TextPlugin" {
  export const TextPlugin: gsap.plugins.TextPlugin;
  export { TextPlugin as default };
}

declare module "gsap/src/TextPlugin" {
  export * from "gsap/TextPlugin";
  export { TextPlugin as default } from "gsap/TextPlugin";
}

declare module "gsap/dist/TextPlugin" {
  export * from "gsap/TextPlugin";
  export { TextPlugin as default } from "gsap/TextPlugin";
}

declare module "gsap/all" {
  export * from "gsap/TextPlugin";
}