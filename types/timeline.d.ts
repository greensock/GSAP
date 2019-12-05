declare namespace gsap.core {

  type TimelineChild = string | Animation | Callback | Array<string | Animation | Callback>;

  interface Labels {
    [key: string]: number;
  }

  class Timeline extends Animation {

    autoRemoveChildren: boolean;
    labels: Labels;
    smoothChildTiming: boolean;
    vars: TimelineVars;

    constructor(vars?: TimelineVars, time?: number);

    static updateRoot(time: number): void;

    add(child: TimelineChild, position?: Position): this;
    addLabel(label: string, position?: Position): this;
    addPause(position?: Position, callback?: Callback, params?: any[]): this;
    call(callback: Callback, params?: any[], position?: Position): this;
    clear(labels?: boolean): this;
    currentLabel(value: string): this;
    currentLabel(): string;
    from(targets: TweenTarget, vars: TweenVars, position?: Position): this;
    from(targets: TweenTarget, duration: number, vars: TweenVars, position?: Position): this;
    fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars, position?: Position): this;
    fromTo(targets: TweenTarget, duration: number, fromVars: TweenVars, toVars: TweenVars, position?: Position): this;
    getChildren(nested?: boolean, tweens?: boolean, timelines?: boolean, ignoreBeforeTime?: number): Tween[] | Timeline[]; 
    getTweensOf(targets: TweenTarget, onlyActive?: boolean): Tween[];
    nextLabel(time?: number): string;
    previousLabel(time?: number): string;
    recent<T extends Tween | Timeline>(): T;
    remove(value: TimelineChild): this;
    removeLabel(label: string): number;
    removePause(position: Position): this;
    set(target: TweenTarget, vars: TweenVars, position?: Position): this;
    shiftChildren(amount: number, adjustLabels?:boolean, ignoreBeforeTime?: number): this;
    to(targets: TweenTarget, vars: TweenVars, position?: Position): this;
    to(targets: TweenTarget, duration: number, vars: TweenVars, position?: Position): this;
    tweenFromTo(fromPosition: Position, toPosition: Position, vars?: TweenVars): Tween;
    tweenTo(position: Position, vars?: TweenVars): Tween;
  }
}
