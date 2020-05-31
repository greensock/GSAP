declare namespace gsap {

  interface TweenVars {
    morphSVG?: SVGPathValue;
  }
}

declare namespace gsap.plugins {

  interface MorphSVGPlugin extends Plugin {
    
    defaultRender?: Function;
    defaultType?: String;
    defaultUpdateTarget?: Boolean;

    /**
     * Converts SVG shapes into <path>s.
     *
     * ```js
     * MorphSVGPlugin.convertToPath("circle");
     * ```
     *
     * @param {DOMTarget} shape
     * @param {boolean} [swap] 
     * @returns {SVGPathElement[]} The converted paths
     * @memberof MorphSVGPlugin
     */
    convertToPath(shape: string | SVGPrimitive | (string | SVGPrimitive)[], swap?: boolean): SVGPathElement[];

    /**
     * Converts a rawPath into a string of path data.
     *
     * ```js
     * MorphSVGPlugin.rawPathToString(myRawPath);
     * ```
     *
     * @param {RawPath} rawPath
     * @returns {string} The converted path data
     * @memberof MorphSVGPlugin
     */
    rawPathToString(rawPath: RawPath): string;

    /**
     * Converts a string of path data into a RawPath.
     *
     * ```js
     * MorphSVGPlugin.stringToRawPath("M0,0 C100,20 300,50 400,0...");
     * ```
     *
     * @param {string} data
     * @returns {RawPath} The converted RawPath
     * @memberof MorphSVGPlugin
     */
    stringToRawPath(data: string): RawPath;
  }

  interface MorphSVGPluginClass extends MorphSVGPlugin {
    new(): PluginScope & MorphSVGPlugin;
    prototype: PluginScope & MorphSVGPlugin;
  }

  const morphSVG: MorphSVGPluginClass;
}

declare const MorphSVGPlugin: gsap.plugins.MorphSVGPlugin;

declare module "gsap/MorphSVGPlugin" {
  export const MorphSVGPlugin: gsap.plugins.MorphSVGPlugin;
  export { MorphSVGPlugin as default };
}

declare module "gsap/dist/MorphSVGPlugin" {
  export * from "gsap/MorphSVGPlugin";
  export { MorphSVGPlugin as default } from "gsap/MorphSVGPlugin";
}

declare module "gsap/src/MorphSVGPlugin" {
  export * from "gsap/MorphSVGPlugin";
  export { MorphSVGPlugin as default } from "gsap/MorphSVGPlugin";
}

declare module "gsap/all" {
  export * from "gsap/MorphSVGPlugin";
}
