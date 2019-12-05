// TODO
declare const MotionPathPlugin: any;

declare module "gsap/MotionPathPlugin" {

  // TODO
  export const MotionPathPlugin: any;
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
