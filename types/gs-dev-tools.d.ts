// TODO
declare const GSDevTools: any;

declare module "gsap/GSDevTools" {

  // TODO
  export const GSDevTools: any;
  export { GSDevTools as default };
}

declare module "gsap/dist/GSDevTools" {
  export * from "gsap/GSDevTools";
  export { GSDevTools as default } from "gsap/GSDevTools";
}

declare module "gsap/src/GSDevTools" {
  export * from "gsap/GSDevTools";
  export { GSDevTools as default } from "gsap/GSDevTools";
}

declare module "gsap/all" {
  export * from "gsap/GSDevTools";
}
