// TODO
declare const MorphSVGPlugin: any;

declare module "gsap/MorphSVGPlugin" {

  // TODO
  export const MorphSVGPlugin: any;
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
