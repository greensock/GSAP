// TODO
declare const ScrambleTextPlugin: any;

declare module "gsap/ScrambleTextPlugin" {

  // TODO
  export const ScrambleTextPlugin: any;
  export { ScrambleTextPlugin as default };
}

declare module "gsap/dist/ScrambleTextPlugin" {
  export * from "gsap/ScrambleTextPlugin";
  export { ScrambleTextPlugin as default } from "gsap/ScrambleTextPlugin";
}

declare module "gsap/src/ScrambleTextPlugin" {
  export * from "gsap/ScrambleTextPlugin";
  export { ScrambleTextPlugin as default } from "gsap/ScrambleTextPlugin";
}

declare module "gsap/all" {
  export * from "gsap/ScrambleTextPlugin";
}
