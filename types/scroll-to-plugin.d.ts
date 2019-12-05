// TODO
declare const ScrollToPlugin: any;

declare module "gsap/ScrollToPlugin" {

  // TODO
  export const ScrollToPlugin: any;
  export { ScrollToPlugin as default };
}

declare module "gsap/dist/ScrollToPlugin" {
  export * from "gsap/ScrollToPlugin";
  export { ScrollToPlugin as default } from "gsap/ScrollToPlugin";
}

declare module "gsap/src/ScrollToPlugin" {
  export * from "gsap/ScrollToPlugin";
  export { ScrollToPlugin as default } from "gsap/ScrollToPlugin";
}

declare module "gsap/all" {
  export * from "gsap/ScrollToPlugin";
}
