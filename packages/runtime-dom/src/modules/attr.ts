export function patchAttr(el: Element, key, nextValue) {
  if (!nextValue) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, nextValue);
  }
}
