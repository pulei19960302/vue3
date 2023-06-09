//操作节点 增 删 改 查

const doc: Document = (
  typeof document !== undefined ? document : null
) as Document;

export const nodeOps = {
  // 创建元素
  createElement: (tag) => {
    const el = doc.createElement(tag);
    return el;
  },

  // 移除元素
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },

  // 插入元素
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },

  // 选择元素
  querySelector: (selector) => doc.querySelector(selector),

  // 设置元素
  setElementText: (el, text) => {
    el.textContent = text;
  },

  createText: (text) => {
    return doc.createTextNode(text);
  },

  setText: (node, text) => {
    node.nodeValue = text;
  },
};
