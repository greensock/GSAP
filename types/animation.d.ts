declare namespace gsap.core {

  // Added to TypeScript 3.5
  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

  class Animation {

    static readonly version: string;

    data: any;

    constructor(vars?: object, time?: number);

    delay(value: number): this;
    delay(): number;
    duration(value: number): this;
    duration(): number;
    endTime(includeRepeats?: boolean): number;
    eventCallback(type: CallbackType, callback: Callback, params?: any[], scope?: object): this;
    eventCallback(type: CallbackType): Callback;
    invalidate(): this;
    isActive(): boolean;
    iteration(value: number, supressEvents?: boolean): this;
    iteration(): number;
    kill(): this; 
    pause(atTime?: number, supressEvents?: boolean): this;
    paused(value: boolean): this;
    paused(): boolean;
    play(from?: number, supressEvents?: boolean): this;
    progress(value: number, supressEvents?: boolean): this;
    progress(): number;
    rawTime(wrapRepeats?: boolean): number;
    repeat(value: number): this;
    repeat(): number;
    repeatDelay(value: number): this;
    repeatDelay(): number;
    restart(includeDelay?: boolean, supressEvents?: boolean): this;
    resume(from?: number, supressEvents?: boolean): this;
    reverse(from?: number, supressEvents?: boolean): this;
    reversed(value: boolean): this;
    reversed(): boolean;
    startTime(value: number): this;
    startTime(): number;
    seek(time: number, supressEvents?: boolean): this;
    then(onFulfilled?: (result: Omit<this, "then">) => any): Promise<this>;
    time(value: number, supressEvents?: boolean): this;
    time(): number;
    timeScale(value: number): this;
    timeScale(): number;
    totalDuration(value: number): this;
    totalDuration(): number;
    totalProgress(value: number, supressEvents?: boolean): this;
    totalProgress(): number;
    totalTime(value: number, supressEvents?: boolean): this;
    totalTime(): number;
    yoyo(value: boolean): this;
    yoyo(): boolean;
  }
}
