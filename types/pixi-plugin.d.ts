// TODO
declare const PixiPlugin: any;

declare module "gsap/PixiPlugin" {

  // TODO
  export const PixiPlugin: any;
  export { PixiPlugin as default };
}

declare module "gsap/dist/PixiPlugin" {
  export * from "gsap/PixiPlugin";
  export { PixiPlugin as default } from "gsap/PixiPlugin";
}

declare module "gsap/src/PixiPlugin" {
  export * from "gsap/PixiPlugin";
  export { PixiPlugin as default } from "gsap/PixiPlugin";
}

declare module "gsap/all" {
  export * from "gsap/PixiPlugin";
}
