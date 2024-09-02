import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type: any, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    component: null
  };

  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 插槽 type组件, children 对象
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children)) {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vnode
}

function getShapeFlag(type: any) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}