// TODO
declare const SplitText: any;

declare module "gsap/SplitText" {

  // TODO
  export const SplitText: any;
  export { SplitText as default };
}

declare module "gsap/dist/SplitText" {
  export * from "gsap/SplitText";
  export { SplitText as default } from "gsap/SplitText";
}

declare module "gsap/src/SplitText" {
  export * from "gsap/SplitText";
  export { SplitText as default } from "gsap/SplitText";
}

declare module "gsap/all" {
  export * from "gsap/SplitText";
}
