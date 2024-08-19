import { createComponentInstance, setupComponent } from "./component"

export function render(vnode: any, rootContainer: any) {
  patch(vnode, rootContainer)
}

function patch(vnode: any, container: any) {
  // TODO 判断 vnode 的类型 component or element

  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance, container);

  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();

  patch(subTree, container);
}

