// TODO
declare const CustomEase: any;

declare module "gsap/CustomEase" {

  // TODO
  export const CustomEase: any;
  export { CustomEase as default };
}

declare module "gsap/dist/CustomEase" {
  export * from "gsap/CustomEase";
  export { CustomEase as default } from "gsap/CustomEase";
}

declare module "gsap/src/CustomEase" {
  export * from "gsap/CustomEase";
  export { CustomEase as default } from "gsap/CustomEase";
}

declare module "gsap/all" {
  export * from "gsap/CustomEase";
}
