declare class Draggable {

  static version: string;
  static zIndex: number;

  readonly autoScroll: number;
  readonly deltaX: number;
  readonly deltaY: number;
  readonly endRotation: number;
  readonly endX: number;
  readonly endY: number;
  readonly isDragging: boolean;
  readonly isThrowing: boolean;
  readonly lockAxis: boolean;
  readonly maxRotation: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly minRotation: number;
  readonly pointerEvent: TouchEvent | PointerEvent;
  readonly pointerX: number;
  readonly pointerY: number;
  readonly rotation: number;
  readonly scrollProxy: any; // TODO: Create interface
  readonly target: HTMLElement | SVGElement;  
  readonly tween: gsap.core.Tween;  
  readonly vars: Draggable.Vars;
  readonly x: number;
  readonly y: number;

  constructor(target: gsap.DOMTarget, vars?: Draggable.Vars);

  static create(target: gsap.DOMTarget, vars?: Draggable.Vars): Draggable[];
  static get(target: gsap.DOMTarget): Draggable;
  static hitTest(testObject1: Draggable.TestObject, testObject2: Draggable.TestObject, threshold?: number | string): boolean;
  static timeSinceDrag(): number;

  addEventListener(type: Draggable.CallbackType, callback: gsap.Callback): void;
  applyBounds(bound: gsap.DOMTarget | Draggable.BoundsMinMax | Draggable.BoundsRectangle | Draggable.BoundsRotation): void;
  disable(): this;
  dispatchEvent(type: Draggable.CallbackType): boolean;
  enable(): this;
  enabled(): boolean;
  endDrag(event: Event): void;
  getDirection(from: "start" | "velocity" | gsap.DOMTarget): Draggable.Direction;
  hitTest(testObject1: Draggable.TestObject, threshold?: number | string): boolean;
  kill(): this;
  removeEventListener(type: Draggable.CallbackType, callback: gsap.Callback): void;
  startDrag(event: Event): void;
  timeSinceDrag(): number;
  update(applyBounds?: boolean, sticky?: boolean): this;
}

declare namespace Draggable {

  type CallbackType = 
    | "click" 
    | "drag" 
    | "dragend" 
    | "dragstart" 
    | "move" 
    | "press" 
    | "release"
    | "throwcomplete"
    | "throwupdate";

  type Direction = 
    | "down"
    | "left"
    | "left-down"
    | "left-up"
    | "up"
    | "right"
    | "right-down"
    | "right-up";

  type DraggableType = 
    | "left"
    | "left,top"
    | "rotation"
    | "scroll"
    | "scrollLeft"
    | "scrollTop"
    | "top"
    | "top,left"
    | "x"
    | "x,y"
    | "y"
    | "y,x";

  type SnapValue = number[] | ((value: number) => number);
  type TestObject = gsap.DOMTarget | Event | Rectangle;

  interface BoundsMinMax {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }

  interface BoundsRectangle {
    height: number;
    left: number;
    top: number;
    width: number;
  }

  interface BoundsRotation {
    minRotation: number;
    maxRotation: number;
  }

  interface Rectangle {
    bottom: number;
    left: number;
    right: number;
    top: number;
  }

  interface SnapObject {
    left?: SnapValue;
    points?: gsap.Point2D[] | ((point: gsap.Point2D) => gsap.Point2D);
    radius?: number;
    rotation?: SnapValue;
    top?: SnapValue;
    x?: SnapValue;
    y?: SnapValue;
  }

  interface Vars {
    [key: string]: any;
    activeCursor?: string;
    allowContextMenu?: boolean;
    allowEventDefault?: boolean;
    allowNativeTouchScrolling?: boolean;
    autoScroll?: number;
    bounds?: gsap.DOMTarget | BoundsMinMax | BoundsRectangle | BoundsRotation;
    callbackScope?: object;
    clickableTest?: (this: Draggable, element: HTMLElement | SVGElement) => void;
    cursor?: string;
    dragClickables?: boolean;
    dragResistance?: number;
    edgeResistance?: number;
    force3D?: "auto" | boolean;    
    inertia?: boolean | gsap.InertiaVars;
    liveSnap?: boolean | SnapValue | SnapObject;
    lockAxis?: boolean;
    maxDuration?: number;
    minDuration?: number;
    minimumMovement?: number;
    onClick?: gsap.Callback;
    onClickParams?: any[];
    onDrag?: gsap.Callback;
    onDragParams?: any[];
    onDragStart?: gsap.Callback;
    onDragStartParams?: any[];
    onDragEnd?: gsap.Callback;
    onDragEndParams?: any[];
    onLockAxis?: (this: Draggable, event: Event) => void;
    onMove?: gsap.Callback;
    onMoveParams?: any[];
    onPress?: gsap.Callback;
    onPressParams?: any[];
    onPressInit?: gsap.Callback;
    onPressInitParams?: any[];
    onRelease?: gsap.Callback;
    onReleaseParams?: any[];
    onThrowComplete?: gsap.Callback;
    onThrowCompleteParams?: any[];
    onThrowUpdate?: gsap.Callback;
    onThrowUpdateParams?: any[];    
    overshootTolerance?: number;
    resistance?: number;
    snap?: SnapValue | SnapObject;    
    throwProps?: boolean | gsap.InertiaVars;
    throwResistance?: number;
    trigger?: gsap.DOMTarget;
    type?: DraggableType;
    zIndexBoost?: boolean;
  }
}

declare module "gsap/Draggable" {
  class _Draggable extends Draggable {}
  export {
    _Draggable as Draggable,
    _Draggable as default
  }
}

declare module "gsap/src/Draggable" {
  export * from "gsap/Draggable";
  export { Draggable as default } from "gsap/Draggable";
}

declare module "gsap/dist/Draggable" {
  export * from "gsap/Draggable";
  export { Draggable as default } from "gsap/Draggable";
}

declare module "gsap/all" {
  export * from "gsap/Draggable";
}
