// TODO
declare const CustomWiggle: any;

declare module "gsap/CustomWiggle" {

  // TODO
  export const CustomWiggle: any;
  export { CustomWiggle as default };
}

declare module "gsap/dist/CustomWiggle" {
  export * from "gsap/CustomWiggle";
  export { CustomWiggle as default } from "gsap/CustomWiggle";
}

declare module "gsap/src/CustomWiggle" {
  export * from "gsap/CustomWiggle";
  export { CustomWiggle as default } from "gsap/CustomWiggle";
}

declare module "gsap/all" {
  export * from "gsap/CustomWiggle";
}
