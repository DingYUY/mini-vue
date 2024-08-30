import { effect } from "../reactivity";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
export function createRenderer(options) {

  const { createElement: hostCreateElement, insert: hostInsert, patchProp: hostPatchProp } = options;

  function render(vnode: any, container: any, parentComponent) {
    patch(null, vnode, container, parentComponent);
  }
  
  function patch(n1:any, n2: any, container: any, parentComponent) {
    //  判断 n2 的类型 component or element
  
    const { shapeFlag, type } = n2;
  
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
  
      case Text:
        processText(n1, n2, container);
        break;
  
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理元素节点
          if (!n1) {
            processElement(n1, n2, container, parentComponent);
          } else {
            patchElement(n1, n2, container, parentComponent);
          }
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }
  
  function processFragment(n1: any, n2: any, container: any, parentComponent: any) {
    mountChildren(n1, n2, container, parentComponent);
  }
  
  function processText(n1: any, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  
  function processElement(n1: any, n2: any, container: any, parentComponent) {
    mountElement(n1, n2, container, parentComponent);
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el)

    patchProps(el, oldProps, newProps);
  }
  
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
      }
    }
  }

  
  function mountElement(n1: any, n2: any, container: any, parentComponent) {
    const el = (n2.el = hostCreateElement(n2.type));
  
    const { props, children, shapeFlag } = n2;
  
    for (const key in props) {
      const val = props[key];
  
      hostPatchProp(el, key, null, val);
    }
  
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n1, n2, el, parentComponent);
    }
  
    hostInsert(el, container);
  }
  
  function mountChildren(n1: any, n2: any, container: any, parentComponent) {
    n2.children.forEach((v) => {
      patch(n1, v, container, parentComponent);
    });
  }
  
  function processComponent(n1: any, n2: any, container: any, parentComponent) {
    mountComponent(n1, n2, container, parentComponent);
  }
  
  function mountComponent(n1: any, n2: any, container: any, parentComponent: any) {
    const instance = createComponentInstance(n2, parentComponent);
  
    setupComponent(instance);
  
    setupRenderEffect(instance, n2, container);
  }
  
  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const subTree = instance.render.call(instance.proxy);
        instance.subTree = subTree;
        console.log("subTree", subTree);

        patch(null, subTree, container, instance);

        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const subTree = instance.render.call(instance.proxy);
        const preSubTree = instance.subTree;
        patch(preSubTree, subTree, container, instance);
      }
    });
  }


  return {
    createApp: createAppApi(render)
  }
}

