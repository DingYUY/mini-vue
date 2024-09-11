import { effect } from "@mini-vue/reactivity";
import { EMPTY_OBJ, getSequence, ShapeFlags } from "@mini-vue/shared";
import { createComponentInstance, setupComponent } from "./component";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { createAppApi } from "./createApp";
import { queueJobs } from "./scheduler";
import { Fragment, Text } from "./vnode";
export function createRenderer(options) {

  const { createElement: hostCreateElement, insert: hostInsert, patchProp: hostPatchProp, remove: hostRemove, setChildren: hostSetChildren } = options;

  function render(vnode: any, container: any, parentComponent) {
    patch(null, vnode, container, parentComponent, null);
  }
  
  function patch(n1: any, n2: any, container: any, parentComponent, anchor) {
    //  判断 n2 的类型 component or element

    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;

      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理元素节点
          if (!n1) {
            processElement(n1, n2, container, parentComponent, anchor);
          } else {
            patchElement(n1, n2, container, parentComponent, anchor);
          }
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }
  
  function processFragment(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }
  
  function processText(n1: any, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  
  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountElement(n1, n2, container, parentComponent, anchor);
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);

    patchChildren(el, n1, n2, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(container, n1, n2, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;

    const c1 = n1.children;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetChildren(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetChildren(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent);
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent) {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, null);
      } else {
        break
      }

      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, null);
      } else {
        break;
      }

      e1--
      e2--
    }

    if (i > e1) {
      // 新的比老的多 创建
      while (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 老的比新的多 删除
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 中间对
      let s1 = i
      let s2 = i

      // 优化
      const toBePatched = e2 - s2 + 1
      let patched = 0
      const keyToNewIndexMap = new Map()
      // 定长数组性能最好
      const newIndexToOldIndexMap = new Array()

      // 优化点，判断需不需要移动
      let moved = false
      let maxNewIndexSoFar = 0

      // 0 代表新的没有，需要移动或者新增
      for (let i = 0; i <= e2 - s2; i++) newIndexToOldIndexMap[i] = 0
      
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i);
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        // 老比新多超出全部删除，无需再次遍历
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }

        let nextIndex
        // undefined || null
        if (prevChild.key != null) {
          nextIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              nextIndex = j
              break
            }
          }
        }

        if (nextIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          if (nextIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = nextIndex
          } else {
            moved = true
          }

          newIndexToOldIndexMap[nextIndex - s2] = i + 1;

          patch(prevChild, c2[nextIndex], container, parentComponent, null)
          patched++
        }
      }

      // 
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1

      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }

      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children.el
      hostRemove(el)
    }
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

  
  function mountElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    const el = (n2.el = hostCreateElement(n2.type));

    const { props, children, shapeFlag } = n2;

    for (const key in props) {
      const val = props[key];

      hostPatchProp(el, key, null, val);
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n2.children, el, parentComponent, anchor);
    }

    hostInsert(el, container, anchor);
  }
  
  function mountChildren(
    children: any,
    container: any,
    parentComponent,
    anchor
  ) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }
  
  function processComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor);
    } else {
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1: any, n2: any) { 
    
    const instance = (n2.component = n1.component)

    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;

      instance.update();
    } else {
      instance.vnode = n2
    }
  }
  
  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent: any,
    anchor
  ) {
    const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent));

    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  
  function setupRenderEffect(
    instance: any,
    initialVNode: any,
    container: any,
    anchor
  ) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy, proxy));

        patch(null, subTree, container, instance, anchor);

        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // update
        const { next, vnode } = instance

        if (next) {
          next.el = vnode.el

          updateComponentPreRender(instance, next)
        }

        const { proxy } = instance
        const subTree = instance.render.call(proxy, proxy);
        const preSubTree = instance.subTree;
        patch(preSubTree, subTree, container, instance, anchor);
      }
    }, {
      scheduler() {
        console.log("update scheduler");
        queueJobs(instance.update)
      }
    });
  }


  return {
    createApp: createAppApi(render)
  }
}

function updateComponentPreRender(instance, nextVNode) {
  instance.vnode = nextVNode
  instance.next = null
  instance.props = nextVNode.props
}

