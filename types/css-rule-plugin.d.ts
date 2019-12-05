// TODO
declare const CSSRulePlugin: any;

declare module "gsap/CSSRulePlugin" {

  // TODO
  export const CSSRulePlugin: any;
  export { CSSRulePlugin as default };
}

declare module "gsap/dist/CSSRulePlugin" {
  export * from "gsap/CSSRulePlugin";
  export { CSSRulePlugin as default } from "gsap/CSSRulePlugin";
}

declare module "gsap/src/CSSRulePlugin" {
  export * from "gsap/CSSRulePlugin";
  export { CSSRulePlugin as default } from "gsap/CSSRulePlugin";
}

declare module "gsap/all" {
  export * from "gsap/CSSRulePlugin";
}
