declare namespace PixiPlugin {
  interface PixiMatrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    array?: number[];
  }

  interface Vars {
    [key: string]: any;
    alpha?: number;
    anchor?: number;
    anchorX?: number;
    anchorY?: number;
    angle?: number;
    autoAlpha?: number;
    blur?: number;
    blurX?: number;
    blurY?: number;
    blurPadding?: number;
    brightness?: number;
    colorize?: string | number;
    colorizeAmount?: number;
    colorMatrixFilter?: object; // TODO
    combineCMF?: boolean;
    contrast?: number;
    fillColor?: string | number;
    height?: number;
    hue?: number;
    lineColor?: string | number;
    matrix?: PixiMatrix;
    pivot?: number;
    pivotX?: number;
    pivotY?: number;
    position?: number;
    positionX?: number;
    positionY?: number;
    resolution?: number;
    rotation?: number | string;
    saturation?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    skew?: number;
    skewX?: number;
    skewY?: number;
    tilePosition?: number;
    tilePositionX?: number;
    tilePositionY?: number;
    tileScale?: number;
    tileScaleX?: number;
    tileScaleY?: number;
    tileX?: number;
    tileY?: number;
    tint?: string | number;
    width?: number;
    x?: number;
    y?: number;
    zIndex?: number;
  }
}

declare namespace gsap {

  interface TweenVars {
    pixi?: PixiPlugin.Vars;
  }
}

declare namespace gsap.plugins {

  interface PixiPlugin extends Plugin {

    /**
     * Registers the main PIXI library object with the PixiPlugin so that it can find the 
     * necessary classes/objects. You only need to register it once.
     * 
     * ```js
     * PixiPlugin.registerPIXI(PIXI);
     * ```
     *
     * @param {object} pixi
     * @memberof PixiPlugin
     */
    registerPIXI(pixi: object): void;
  }

  interface PixiPluginClass extends PixiPlugin {
    new(): PluginScope & PixiPlugin;
    prototype: PluginScope & PixiPlugin;
  }

  const pixi: PixiPluginClass;
}

declare const PixiPlugin: gsap.plugins.PixiPlugin;

declare module "gsap/PixiPlugin" {
  export const PixiPlugin: gsap.plugins.PixiPlugin;
  export { PixiPlugin as default };
}

declare module "gsap/src/PixiPlugin" {
  export * from "gsap/PixiPlugin";
  export { PixiPlugin as default } from "gsap/PixiPlugin";
}

declare module "gsap/dist/PixiPlugin" {
  export * from "gsap/PixiPlugin";
  export { PixiPlugin as default } from "gsap/PixiPlugin";
}

declare module "gsap/all" {
  export * from "gsap/PixiPlugin";
}
