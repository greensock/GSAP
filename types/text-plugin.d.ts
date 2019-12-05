// TODO
declare const TextPlugin: any;

declare module "gsap/TextPlugin" {

  // TODO
  export const TextPlugin: any;
  export { TextPlugin as default };
}

declare module "gsap/dist/TextPlugin" {
  export * from "gsap/TextPlugin";
  export { TextPlugin as default } from "gsap/TextPlugin";
}

declare module "gsap/src/TextPlugin" {
  export * from "gsap/TextPlugin";
  export { TextPlugin as default } from "gsap/TextPlugin";
}

declare module "gsap/all" {
  export * from "gsap/TextPlugin";
}
