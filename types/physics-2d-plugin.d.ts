// TODO
declare const Physics2DPlugin: any;

declare module "gsap/Physics2DPlugin" {

  // TODO
  export const Physics2DPlugin: any;
  export { Physics2DPlugin as default };
}

declare module "gsap/dist/Physics2DPlugin" {
  export * from "gsap/Physics2DPlugin";
  export { Physics2DPlugin as default } from "gsap/Physics2DPlugin";
}

declare module "gsap/src/Physics2DPlugin" {
  export * from "gsap/Physics2DPlugin";
  export { Physics2DPlugin as default } from "gsap/Physics2DPlugin";
}

declare module "gsap/all" {
  export * from "gsap/Physics2DPlugin";
}
