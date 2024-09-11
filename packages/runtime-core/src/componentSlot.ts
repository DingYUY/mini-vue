import { ShapeFlags } from "@mini-vue/shared";


export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValues(value(props))
  }
}

function normalizeSlotValues(value) {
  return Array.isArray(value) ? value : [value]
}