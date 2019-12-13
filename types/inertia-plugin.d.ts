declare namespace gsap {

  type InertiaEndFunction<T> = (value: T) => T;

  interface InertiaDuration {
    min?: number;
    max?: number;
    overshoot?: number; 
  }

  interface InertiaLinkedProps {
    [key: string]: number;
  }

  interface InertiaObject {
    velocity?: number | "auto";
    min?: number;
    max?: number;
    end?: number | number[] | InertiaEndFunction<any>;
    // end?: number | number[] | InertiaEndFunction<number> | InertiaEndFunction<InertiaLinkedProps>; 
  }

  type InertiaVars = {
    duration?: number | InertiaDuration,
    linkedProps?: string,
    resistance?: number
  } & {
    [key: string]: TweenValue | InertiaObject
  };

  interface TweenVars {
    inertia?: InertiaVars;
  }
}

declare namespace gsap.plugins {

  interface InertiaPlugin extends Plugin, VelocityTrackerStatic { }

  interface InertiaPluginClass extends InertiaPlugin {
    new(): PluginScope & InertiaPlugin;
    prototype: PluginScope & InertiaPlugin;
  }

  const inertia: InertiaPluginClass;
}

declare const InertiaPlugin: gsap.plugins.InertiaPlugin;

declare module "gsap/InertiaPlugin" {
  export * from "gsap/utils/VelocityTracker";
  export const InertiaPlugin: gsap.plugins.InertiaPlugin;
  export { InertiaPlugin as default };
}

declare module "gsap/dist/InertiaPlugin" {
  export * from "gsap/InertiaPlugin";
  export { InertiaPlugin as default } from "gsap/InertiaPlugin";
}

declare module "gsap/src/InertiaPlugin" {
  export * from "gsap/InertiaPlugin";
  export { InertiaPlugin as default } from "gsap/InertiaPlugin";
}

declare module "gsap/all" {
  export * from "gsap/InertiaPlugin";
}
