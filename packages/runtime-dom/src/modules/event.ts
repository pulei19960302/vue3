export function patchEvent(el, key, prevValue, nextValue) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[key];
  if (nextValue && existingInvoker) {
    // patch
    existingInvoker.value = nextValue;
  } else {
    const name = parseName(key);
    if (nextValue) {
      // add
      const invoker = (invokers[key] = createInvoker(nextValue));
      el.addEventListener(name, invoker);
    } else if (existingInvoker) {
      // remove
      el.removeEventListener(name, existingInvoker);
      invokers[key] = undefined;
    }
  }
}

function parseName(key: string) {
  return key?.slice(2).toLowerCase();
}

function createInvoker(fn) {
  const invoker = (e: Event) => {
    //TODO this
    invoker.value(e);
  };
  invoker.value = fn;
  return invoker;
}
