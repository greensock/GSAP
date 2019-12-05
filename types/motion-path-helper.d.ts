// TODO
declare const MotionPathHelper: any;

declare module "gsap/MotionPathHelper" {

  // TODO
  export const MotionPathHelper: any;
  export { MotionPathHelper as default };
}

declare module "gsap/dist/MotionPathHelper" {
  export * from "gsap/MotionPathHelper";
  export { MotionPathHelper as default } from "gsap/MotionPathHelper";
}

declare module "gsap/src/MotionPathHelper" {
  export * from "gsap/MotionPathHelper";
  export { MotionPathHelper as default } from "gsap/MotionPathHelper";
}

declare module "gsap/all" {
  export * from "gsap/MotionPathHelper";
}
