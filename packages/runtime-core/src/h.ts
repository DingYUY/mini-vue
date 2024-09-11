import { createVNode } from './vnode'

export function h(type: any, props?, children?) {
  return createVNode(type, props, children)
}