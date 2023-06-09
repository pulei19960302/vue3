export function patchClass(el: Element, value) {
  if (!value) {
    el.removeAttribute("class");
  } else {
    el.setAttribute("class", value);
  }
}
