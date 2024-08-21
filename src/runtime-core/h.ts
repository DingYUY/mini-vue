import { createVNode } from './vnode'

export function h(type: any, props?, children?) {
  createVNode(type, props, children)
}