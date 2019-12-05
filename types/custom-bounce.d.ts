// TODO
declare const CustomBounce: any;

declare module "gsap/CustomBounce" {

  // TODO
  export const CustomBounce: any;
  export { CustomBounce as default };
}

declare module "gsap/dist/CustomBounce" {
  export * from "gsap/CustomBounce";
  export { CustomBounce as default } from "gsap/CustomBounce";
}

declare module "gsap/src/CustomBounce" {
  export * from "gsap/CustomBounce";
  export { CustomBounce as default } from "gsap/CustomBounce";
}

declare module "gsap/all" {
  export * from "gsap/CustomBounce";
}
