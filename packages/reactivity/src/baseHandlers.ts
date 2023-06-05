import { isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";
import { track } from "./effect";
import { TrackOpTypes } from "./operations";
import type { Target } from "./reactive";

// 创建get
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver);

    // 不是只读的 收集依赖
    if (!isReadonly) {
      //收集effect
      track(target, TrackOpTypes.GET, key);
    }

    // 不是浅层
    if (!shallow) {
      return res;
    }

    // 对象 懒代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

// 创建set
function createSetter(shallow = false) {
  // 触发更新
  return function set(
    target: Target,
    key: string | symbol,
    value: any,
    receiver: object
  ) {
    const res = Reflect.set(target, key, value, receiver);
    return res;
  };
}

// get函数
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// set 函数
const set = createSetter();
const shallowSet = createSetter(true);

export const reactiveHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};
