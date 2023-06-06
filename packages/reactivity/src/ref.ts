import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
import type { Dep } from "./effect";
import { hasChanged } from "@vue/shared";

export interface Ref<T = any> {
  value: T;
  [key: string]: any;
}

export function ref(target: any) {
  return createRef(target);
}

export function shallowRef(target) {
  return createRef(target, true);
}

function createRef(target: any, shallow = false) {
  return new RefImpl(target, shallow);
}

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;

  public readonly __v_isRef = true;

  public dep?: Dep = undefined;

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._value = value; // 用户传递过来的值
    this._rawValue = value;
  }

  get value() {
    // 收集依赖
    track(this, TrackOpTypes.GET, "value");
    return this._value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = newVal;
      trigger(this, TriggerOpTypes.SET, "value", newVal);
    }
  }
}
