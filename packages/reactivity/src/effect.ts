import { Target } from "./reactive";
import { TrackOpTypes } from "./operations";

export interface ReactiveEffectOptions {
  lazy?: boolean;
}

export let activeEffect: () => any | undefined;
export let uid = 0;

/**
 * 1、定义effect
 * 2、定义相关属性
 */
export function effect<T = VoidFunction>(
  fn: () => T,
  options?: ReactiveEffectOptions
) {
  const effect = createReactiveEffect<T>(fn, options);
  if (!options?.lazy) {
    effect?.();
  }
  return effect;
}

// 全局变量，会出现effect嵌套的问题。导致收集不准确
// effect(()=> { effect1
//   a.name  ---> 收集effect1
//   effect(() => { effect2
//     b.name ----> 收集effect2
//   })
//   a.age ----> 收集effect2 （全局变量问题）
// })

// 定义一个数组来保存effect的嵌套
const effectStack = [];

function createReactiveEffect<T>(
  fn: () => T,
  options?: ReactiveEffectOptions
): VoidFunction {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      // 已经存在了effect
      try {
        effectStack.push(effect);
        activeEffect = effect;
        fn?.();
      } finally {
        // 出栈
        effectStack.pop();
        // 判断是不是还有effect
        const len = effectStack.length;
        activeEffect = len > 0 ? effectStack[len - 1] : undefined;
      }
    }
  };
  // 添加effect特有属性
  effect.id = uid++; // 区分effect
  effect._isEffect = true; // 是否是effect
  effect.raw = fn; // 保存原始方法
  effect.options = options; // 保存effect配置
  return effect;
}

// 定义effect
// 收集effect 在获取数据的时候收集依赖
let targetMap = new WeakMap<Target, any>();
export function track(
  target: Target,
  type: TrackOpTypes,
  key: string | symbol
) {
  if (!activeEffect) {
    return;
  }

  // target ---> key ---> effect
  // WeakMap(target, Map(key, Set[activeEffect]))
  let depMap: Map<string | Symbol, Set<() => any>> = targetMap.get(target);
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()));
  }
  let dep = depMap.get(key);
  if (!dep) {
    depMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}
