// 渲染方法
// 接受操作dom的方法，这里可以传入其他的平台对节点的操作
function createRender(renderOptionDom) {
  // 告诉他是那个组件那个属性
  function createApp(rootComponent, rootProps) {
    // 挂载的容器
    function mount(container) {
      console.log(container, rootComponent, rootProps, renderOptionDom);
    }
    let app = {
      mount,
    };
    return app;
  }
  return {
    createApp,
  };
}

export { createRender };
