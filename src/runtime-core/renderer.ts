import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  //  判断 vnode 的类型 component or element
  if (typeof vnode.type === "string") {
    // 处理元素节点
    precessElement(vnode, container);
  } else {
    // 处理组件
    processComponent(vnode, container);
  }
}

function precessElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { props, children } = vnode;

  for (const key in props) {
    el.setAttribute(key, props[key]);
  }

  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  container.append(el)
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(initialVNode: any, container: any) {
  mountComponent(initialVNode, container);
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance, container);

  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy);

  patch(subTree, container);

  // element -> mount
  initialVNode.el = subTree.el;
}

