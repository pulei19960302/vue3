import { isObject } from "@vue/shared";
import {
  reactiveHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export interface Target {
  [key: string]: any;
}

export const reactiveMap = new WeakMap<Target, any>();
export const shallowReactiveMap = new WeakMap<Target, any>();
export const readonlyMap = new WeakMap<Target, any>();
export const shallowReadonlyMap = new WeakMap<Target, any>();

export function reactive(target: Target) {
  return createReactiveObject(target, false, reactiveHandlers, reactiveMap);
}

export function readonly(target: Target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyMap);
}

export function shallowReactive(target: Target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowReactiveMap
  );
}

export function shallowReadonly(target: Target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyMap
  );
}

// 1、是不是只读  2、是不是深层次
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`);
    return target;
  }
  // 判断是不是已经代理过了
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(target, baseHandlers);
  // 存入缓存
  proxyMap.set(target, proxy);
  return proxy;
}
