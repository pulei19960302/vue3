import { effect } from "./effect";
import { isFunction, NOOP } from "@vue/shared";
import type { ReactiveEffectOptions } from "./effect";

export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}

export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  // 参数  1、函数 2、对象
  let getter: ComputedGetter<T>;
  let setter: ComputedSetter<T>;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions as ComputedGetter<T>;
    setter = NOOP;
  } else {
    getter = (getterOrOptions as WritableComputedOptions<T>).get;
    setter = (getterOrOptions as WritableComputedOptions<T>).set;
  }
  return new ComputedRefImpl<T>(getter, setter);
}

class ComputedRefImpl<T> {
  private _value: T;
  public readonly effect: () => T;

  public readonly __v_isRef = true;

  public _dirty = true; // 默认执行
  public _cacheable: boolean;

  private getter: ComputedGetter<T>;
  private setter: ComputedSetter<T>;

  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this.effect = effect(this.getter, {
      lazy: true,
      scheduler: () => {
        this._dirty = true;
      },
    });
  }

  get value() {
    if (this._dirty) {
      this._value = this.effect();
      this._dirty = false;
    }
    return this._value;
  }

  set value(newValue) {
    this.setter(newValue);
  }
}
