// TODO
declare const EaselPlugin: any;

declare module "gsap/EaselPlugin" {

  // TODO
  export const EaselPlugin: any;
  export { EaselPlugin as default };
}

declare module "gsap/dist/EaselPlugin" {
  export * from "gsap/EaselPlugin";
  export { EaselPlugin as default } from "gsap/EaselPlugin";
}

declare module "gsap/src/EaselPlugin" {
  export * from "gsap/EaselPlugin";
  export { EaselPlugin as default } from "gsap/EaselPlugin";
}

declare module "gsap/all" {
  export * from "gsap/EaselPlugin";
}
