// TODO
declare const Physics2PropsPlugin: any;

declare module "gsap/PhysicsPropsPlugin" {

  // TODO
  export const PhysicsPropsPlugin: any;
  export { PhysicsPropsPlugin as default };
}

declare module "gsap/dist/PhysicsPropsPlugin" {
  export * from "gsap/PhysicsPropsPlugin";
  export { PhysicsPropsPlugin as default } from "gsap/PhysicsPropsPlugin";
}

declare module "gsap/src/PhysicsPropsPlugin" {
  export * from "gsap/PhysicsPropsPlugin";
  export { PhysicsPropsPlugin as default } from "gsap/PhysicsPropsPlugin";
}

declare module "gsap/all" {
  export * from "gsap/PhysicsPropsPlugin";
}
