declare class SplitText {
  readonly chars: Element[];
  readonly lines: Element[];
  readonly words: Element[];
  readonly selector: string | Function;

  constructor(target: gsap.DOMTarget, vars?: SplitText.Vars);


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
   */
  split(vars: SplitText.Vars): SplitText;


  /**
   * Reverts the innerHTML to the original content.
   * 
   * ```js
   * split.revert();
   * ```
   *
   * @memberof SplitText
   */
  revert(): void;
}

declare namespace SplitText {
  interface Vars {
    [key: string]: any;
    type?: string;
    charsClass?: string;
    wordsClass?: string;
    linesClass?: string;
    position?: string;
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
