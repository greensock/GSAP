declare namespace gsap.utils {

  interface DistributeConfig {
    amount?: number;
    axis?: "x" | "y";
    base?: number;
    each?: number;
    ease?: string | EaseFunction;
    from?: "start" | "center" | "end" | "edges" | "random" | number | [number, number];
    grid?: "auto" | [number, number];
  }

  function checkPrefix(value: string): string;

  function clamp(minimum: number, maximum: number, valueToClamp: number): number;
  function clamp(minimum: number, maximum: number): (valueToClamp: number) => number;

  function distribute(config: DistributeConfig): FunctionBasedValue<number>;

  function getUnit(value: string): string;
  
  function interpolate<T>(startValue: T, endValue: T, progress: number): T;
  function interpolate<T>(startValue: T, endValue: T): (progress: number) => T;
  function interpolate<T>(array: T[], progress: number): T;
  function interpolate<T>(array: T[]): (progress: number) => T;
  
  function mapRange(inMin: number, inMax: number, outMin: number, outMax: number, value: number): number;
  function mapRange(inMin: number, inMax: number, outMin: number, outMax: number): (value: number) => number;
  
  function normalize(inMin: number, inMax: number, value: number): number;
  function normalize(inMin: number, inMax: number): (value: number) => number;

  function pipe<A extends Array<unknown>, B>(
    ab: (...a: A) => B
  ): (...a: A) => B;
  function pipe<A extends Array<unknown>, B, C>(
    ab: (...a: A) => B, 
    bc: (b: B) => C
  ): (...a: A) => C
  function pipe<A extends Array<unknown>, B, C, D>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D
  ): (...a: A) => D;
  function pipe<A extends Array<unknown>, B, C, D, E>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): (...a: A) => E;
  function pipe<A extends Array<unknown>, B, C, D, E, F>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): (...a: A) => F;
  function pipe<A extends Array<unknown>, B, C, D, E, F, G>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): (...a: A) => G;
  function pipe<A extends Array<unknown>, B, C, D, E, F, G, H>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): (...a: A) => H;
  function pipe<A extends Array<unknown>, B, C, D, E, F, G, H, I>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): (...a: A) => I;
  function pipe<A extends Array<unknown>, B, C, D, E, F, G, H, I, J>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): (...a: A) => J;

  function random<T>(array: T[]): T;
  function random<T, U extends boolean>(array: T[], returnFunction?: U): U extends true ? () => T : T;
  function random(minValue: number, maxValue: number, snapIncrement?: number): number;
  function random<T extends boolean>(minValue: number, maxValue: number, returnFunction?: T): T extends true ? () => number : number;
  function random<T extends boolean>(minValue: number, maxValue: number, snapIncrement: number, returnFunction?: T): T extends true ? () => number : number;

  function shuffle<T>(array: T[]): T[];

  function snap(snapIncrement: number | number[], valueToSnap: number): number;
  function snap(snapIncrement: number | number[]): (valueToSnap: number) => number;
  function snap(snapValues: { values: number[], radius?: number }, valueToSnap: number): number;
  function snap(snapValues: { values: number[], radius?: number }): (valueToSnap: number) => number;
  function snap(snapValues: { values: Point2D[], radius?: number }, valueToSnap: Point2D): Point2D;
  function snap(snapValues: { values: Point2D[], radius?: number }): (valueToSnap: Point2D) => Point2D;

  function splitColor(color: string, hsl?: boolean): [number, number, number] | [number, number, number, number];

  // function toArray<T>(value: string | object, leaveStrings?: boolean): T[];
  function toArray<T>(value: string | object | Element | null, leaveStrings?: boolean): T[];

  function unitize<T extends Array<unknown>>(fn: (...args: T) => unknown, unit?: string): (...args: T) => string;

  function wrap(value1: number, value2: number, index: number): number;
  function wrap(value1: number, value2: number): (index: number) => number;
  function wrap<T>(values: T[], index: number): T;
  function wrap<T>(values: T[]): (index: number) => T;

  function wrapYoyo(value1: number, value2: number, index: number): number;
  function wrapYoyo(value1: number, value2: number): (index: number) => number;
  function wrapYoyo<T>(values: T[], index: number): T;
  function wrapYoyo<T>(values: T[]): (index: number) => T;
}

declare module "gsap/gsap-core" {
  export const clamp: typeof gsap.utils.clamp;
  export const distribute: typeof gsap.utils.distribute;
  export const getUnit: typeof gsap.utils.getUnit;
  export const interpolate: typeof gsap.utils.interpolate; 
  export const mapRange: typeof gsap.utils.mapRange;
  export const normalize: typeof gsap.utils.normalize;
  export const pipe: typeof gsap.utils.pipe;
  export const random: typeof gsap.utils.random;
  export const shuffle: typeof gsap.utils.shuffle;
  export const snap: typeof gsap.utils.snap;
  export const splitColor: typeof gsap.utils.splitColor;
  export const toArray: typeof gsap.utils.toArray;
  export const unitize: typeof gsap.utils.unitize;
  export const wrap: typeof gsap.utils.wrap;
  export const wrapYoyo: typeof gsap.utils.wrapYoyo;
}
