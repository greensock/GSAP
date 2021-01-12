declare namespace gsap {

  interface PathObject {
    [propName: string]: number;
  }

  interface TweenVars {
    motionPath?: SVGPathValue | TweenValue | Point2D[]| PathObject[] | MotionPath.Vars;
  }
}

declare namespace gsap.plugins {

  interface ArrayToRawPathObject {
    curviness?: number;
    relative?: boolean;
    type?: string;
    x?: string;
    y?: string;
  }

  interface getRelativePositionObject extends gsap.Point2D {
    angle: number;
  }

  interface MotionPathPlugin extends Plugin {

    /**
     * Takes an array of coordinates and plots a curve through them.
     *
     * ```js
     * MotionPathPlugin.arrayToRawPath(anchors, {curviness:0.5})
     * ```
     *
     * @param {Point2D[]} values
     * @param {ArrayToRawPathObject} vars
     * @returns {RawPath} The converted rawPath
     * @memberof MotionPathPlugin
     */
    arrayToRawPath(values: Point2D[], vars?: ArrayToRawPathObject): RawPath;

    /**
     * Measures the path and caches the values on the RawPath itself for fast and accurate subsequent processing.
     *
     * ```js
     * MotionPathPlugin.cacheRawPathMeasurements(rawPath);
     * ```
     *
     * @param {RawPath} rawPath
     * @param {number} resolution
     * @returns {RawPath} the RawPath that was passed in
     * @memberof MotionPathPlugin
     */
    cacheRawPathMeasurements(rawPath: RawPath, resolution?: number): RawPath;

    /**
     * Gets the matrix to convert points from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * MotionPathPlugin.convertCoordinates(fromElement, toElement);
     * ```
     * 
     * @param {Element} fromElement
     * @param {Element} toElement
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof MotionPathPlugin
     */
    convertCoordinates(fromElement: Element, toElement: Element): Matrix2D;

    /**
     * Converts a point from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * MotionPathPlugin.convertCoordinates(fromElement, toElement, point);
     * ```
     * 
     * @param {Element} fromElement
     * @param {Element} toElement
     * @param {Point2D} point
     * @returns {Point2D} the converted point
     * @memberof MotionPathPlugin
     */
      convertCoordinates(fromElement: Element, toElement: Element, point: Point2D): Point2D;

    /**
     * Converts SVG shapes into <path>s.
     *
     * ```js
     * MotionPathPlugin.convertToPath("circle");
     * ```
     *
     * @param {DOMTarget} shape
     * @param {boolean} [swap] 
     * @returns {SVGPathElement[]} The converted paths
     * @memberof MotionPathPlugin
     */
    convertToPath(shape: SVGPathTarget, swap?: boolean): SVGPathElement[];

    /**
     * Gets the matrix to convert points from one element's local coordinates into a
     * different element's local coordinate system.
     *
     * ```js
     * MotionPathPlugin.getAlignMatrix(fromElement, toElement);
     * ```
     * 
     * @param {Element} fromElement
     * @param {Element} toElement
     * @param {number[] | Point2D} [fromOrigin]
     * @param {number[] | Point2D | "auto"} [toOrigin]
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof MotionPathPlugin
     */
    getAlignMatrix(fromElement: Element, toElement: Element, fromOrigin?: number[] | Point2D, toOrigin?: number[] | Point2D | "auto"): Matrix2D;

    /**
     * Gets the Matrix2D that would be used to convert the element's local coordinate 
     * space into the global coordinate space.
     *
     * ```js
     * MotionPathPlugin.getGlobalMatrix(element);
     * ```
     * 
     * @param {Element} element
     * @param {Boolean} [inverse]
     * @param {Boolean} [adjustGOffset]
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof MotionPathPlugin
     */
    getGlobalMatrix(element: Element, inverse?: boolean, adjustGOffset?: boolean): Matrix2D;

    /**
     * Calculates the x/y position (and optionally the angle) corresponding to a 
     * particular progress value along the RawPath.
     *
     * ```js
     * MotionPathPlugin.getPositionOnPath(rawPath, 0.5);
     * ```
     * 
     * @param {RawPath} rawPath
     * @param {Number} progress
     * @param {Boolean} [includeAngle]
     * @returns {Matrix2D} A matrix to convert from one element's coordinate system to another's
     * @memberof MotionPathPlugin
     */
    getPositionOnPath(rawPath: RawPath, progress: number, includeAngle?: boolean): Point2D | getRelativePositionObject;

    /**
     * Gets the RawPath for the provided element or raw SVG <path> data. 
     *
     * ```js
     * MotionPathPlugin.getRawPath(element);
     * ```
     * 
     * @param {DOMTarget} value
     * @returns {RawPath} The rawPath
     * @memberof MotionPathPlugin
     */
    getRawPath(value: SVGPathValue): RawPath;

    /**
     * Gets the x and y distances between two elements regardless of nested transforms.
     *
     * ```js
     * MotionPathPlugin.getRelativePosition(dot, inner, [0.5, 0.5], [0.5, 0.5]);
     * ```
     * 
     * @param {Element} fromElement
     * @param {Element} toElement
     * @param {number[] | Point2D[]} [fromOrigin]
     * @param {number[] | Point2D[] | "auto"} [toOrigin]
     * @returns {Point2D} The x and y between the references given
     * @memberof MotionPathPlugin
     */
    getRelativePosition(fromElement: Element, toElement: Element, fromOrigin?: number[] | Point2D, toOrigin?: number[] | Point2D | "auto"): Point2D;

    /**
     * Gets the x and y distances between two elements regardless of nested transforms.
     *
     * ```js
     * MotionPathPlugin.pointsToSegment([0,0, 10,10, ...], 0.5);
     * ```
     * 
     * @param {number[]} points
     * @param {number} [curviness]
     * @returns {number[]} Cubic Bezier data in alternating x, y, x, y format
     * @memberof MotionPathPlugin
     */
    pointsToSegment(points: number[], curviness?: number): number[];

    /**
     * Converts a RawPath to a path string.
     *
     * ```js
     * MotionPathPlugin.rawPathToString(rawPath);
     * ```
     * 
     * @param {RawPath} rawPath
     * @returns {string} The converted path
     * @memberof MotionPathPlugin
     */
    rawPathToString(rawPath: RawPath): string;

    /**
     * Slices a RawPath into a smaller RawPath.
     *
     * ```js
     * MotionPathPlugin.sliceRawPath(rawPath, 0, 3);
     * ```
     * 
     * @param {RawPath} rawPath
     * @param {number} start
     * @param {number} end
     * @returns {RawPath} The sliced RawPath
     * @memberof MotionPathPlugin
     */
    sliceRawPath(rawPath: RawPath, start: number, end: number): RawPath;

    /**
     * Converts a string of path data into a rawPath.
     *
     * ```js
     * MotionPathPlugin.stringToRawPath("M0,0 C100,20 300,50 400,0...");
     * ```
     *
     * @param {string} data
     * @returns {RawPath} The converted RawPath
     * @memberof MotionPathPlugin
     */
    stringToRawPath(data: string): RawPath;
  }

  interface MotionPathPluginClass extends MotionPathPlugin {
    new(): PluginScope & MotionPathPlugin;
    prototype: PluginScope & MotionPathPlugin;
  }

  const motionPath: MotionPathPluginClass;
}

declare namespace MotionPath {
  interface Vars {
    align?: string | Element;
    alignOrigin?: number[];
    autoRotate?: boolean | number;
    curviness?: number;
    end?: number;
    offsetX?: number;
    offsetY?: number;
    path?: gsap.SVGPathValue | gsap.TweenValue | gsap.Point2D[]| gsap.PathObject[];
    relative?: boolean;
    resolution?: number;
    start?: number;
    type?: string;
    useRadians?: boolean;
  }
}

declare const MotionPathPlugin: gsap.plugins.MotionPathPlugin;

declare module "gsap/MotionPathPlugin" {
  export const MotionPathPlugin: gsap.plugins.MotionPathPlugin;
  export { MotionPathPlugin as default };
}

declare module "gsap/dist/MotionPathPlugin" {
  export * from "gsap/MotionPathPlugin";
  export { MotionPathPlugin as default } from "gsap/MotionPathPlugin";
}

declare module "gsap/src/MotionPathPlugin" {
  export * from "gsap/MotionPathPlugin";
  export { MotionPathPlugin as default } from "gsap/MotionPathPlugin";
}

declare module "gsap/all" {
  export * from "gsap/MotionPathPlugin";
}
