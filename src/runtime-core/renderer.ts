import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {

  const { createElement: hostCreateElement, insert: hostInsert, patchProp: hostPatchProp } = options;

  function render(vnode: any, container: any, parentComponent) {
    patch(vnode, container, parentComponent);
  }
  
  function patch(vnode: any, container: any, parentComponent) {
    //  判断 vnode 的类型 component or element
  
    const { shapeFlag, type } = vnode;
  
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
  
      case Text:
        processText(vnode, container);
        break;
  
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理元素节点
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }
  
  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }
  
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }
  
  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }
  
  
  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));
  
    const { props, children, shapeFlag } = vnode;
  
    for (const key in props) {
      const val = props[key];
  
      hostPatchProp(el, key, val);
    }
  
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }
  
    hostInsert(el, container);
  }
  
  function mountChildren(vnode: any, container: any, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }
  
  function processComponent(initialVNode: any, container: any, parentComponent) {
    mountComponent(initialVNode, container, parentComponent);
  }
  
  function mountComponent(initialVNode: any, container: any, parentComponent: any) {
    const instance = createComponentInstance(initialVNode, parentComponent);
  
    setupComponent(instance);
  
    setupRenderEffect(instance, initialVNode, container);
  }
  
  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance;
  
    const subTree = instance.render.call(proxy);
  
    patch(subTree, container, instance);
  
    // element -> mount
    initialVNode.el = subTree.el;
  }


  return {
    createApp: createAppApi(render)
  }
}

