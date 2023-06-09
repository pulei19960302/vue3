import { isOn } from "@vue/shared";
import { patchClass } from "./modules/class";
import { patchStyle } from "./modules/style";
import { patchEvent } from "./modules/event";
import { patchAttr } from "./modules/attr";

const nativeOnRE = /^on[a-z]/; // 判断是不是方法的正则
//操作属性
export const patchProps = (el, key, prevValue, nextValue) => {
  if (key === "class") {
    patchClass(el, nextValue);
    // 处理class逻辑
  } else if (key === "style") {
    // 处理style
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    patchEvent(el, key, prevValue, nextValue);
  } else {
    patchAttr(el, key, nextValue);
  }
};
