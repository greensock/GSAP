declare class SplitText {
  readonly chars: Element[];
  readonly lines: Element[];
  readonly words: Element[];
  readonly selector: string | Function;

  constructor(target: gsap.DOMTarget, vars?: SplitText.Vars);


  /**
   * Reverts the innerHTML to the original content.
   * 
   * ```js
   * split.revert();
   * ```
   *
   * @memberof SplitText
   * @link https://greensock.com/docs/v3/Plugins/SplitText/revert()
   */
  revert(): void;

  /**
   * Re-splits a SplitText according to the vars provided. It will automatically call revert() first if necessary. Useful if you want to change the way the text is split after the SplitText instance is created.
   * 
   * ```js
   * split.split({type: "lines,chars"});
   * ```
   *
   * @param {SplitText.Vars} vars
   * @returns {SplitText} The SplitText object created
   * @memberof SplitText
   * @link https://greensock.com/docs/v3/Plugins/SplitText/split()
   */
  split(vars: SplitText.Vars): SplitText;
}

declare namespace SplitText {
  interface Vars {
    [key: string]: any;
    type?: string;
    charsClass?: string;
    wordsClass?: string;
    linesClass?: string;
    position?: string;
    lineThreshold?: number;
    reduceWhiteSpace?: boolean;
    specialChars?: string[] | Function;
    wordDelimiter?: string;
  }
}

declare module "gsap/SplitText" {
  class _SplitText extends SplitText {}
  export {
    _SplitText as SplitText,
    _SplitText as default
  }
}

declare module "gsap/src/SplitText" {
  export * from "gsap/SplitText";
  export { SplitText as default } from "gsap/SplitText";
}

declare module "gsap/dist/SplitText" {
  export * from "gsap/SplitText";
  export { SplitText as default } from "gsap/SplitText";
}

declare module "gsap/all" {
  export * from "gsap/SplitText";
}
