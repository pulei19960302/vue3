import {
  hasOwn,
  isArray,
  isIntegerKey,
  isObject,
  hasChanged,
} from "@vue/shared";
import { reactive, readonly } from "./reactive";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
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
    if (shallow) {
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
    const oldValue = target[key];

    // 原始值是数组，并且key是number （name[1] = 1） 这种形式的修改
    // hadKey 就是用来判断在原始数据中存不存在以下为情况说明
    /**
     * originData = {name: '111'}
     * update: originData.sex = '1'
     * finalData = {name: '111', sex: '1'}
     *
     * originData = [1,2]
     * update: originData[4] = '1'
     * finalData = [1, 2, empty × 1,1]
     */
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);

    const result = Reflect.set(target, key, value, receiver); // 更改值
    if (!hadKey) {
      // 新增
      trigger(target, TriggerOpTypes.ADD, key, value);
    } else if (hasChanged(value, oldValue)) {
      // 修改
      trigger(target, TriggerOpTypes.SET, key, value, oldValue);
    }
    return result;
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
