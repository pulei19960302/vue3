import { createRender } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProps } from "./patchProps";

const renderOptionDom = Object.assign({ patchProps }, nodeOps);

function createApp(rootComponent, rootProps) {
  let app = createRender(renderOptionDom).createApp(rootComponent, rootProps);

  let { mount } = app;
  app.mount = function (container) {
    // 挂载组件
    // 清空自己的内容
    container = nodeOps.querySelector(container);
    (container as HTMLElement).innerHTML = "";
    mount(container);
  };
  return app;
}

export { renderOptionDom, createApp };
