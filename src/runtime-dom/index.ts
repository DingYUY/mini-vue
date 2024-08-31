import { createRenderer } from "../runtime-core/renderer";


export function createElement(type) {
  return document.createElement(type);
}

export function patchProp(el, key, prevProp, nextProp) {
  // 例如 onClick ... 事件处理
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextProp);
  } else {
    if (nextProp === undefined || nextProp === null) {
      el.removeAttribute(key, nextProp);
    } else {
      el.setAttribute(key, nextProp);
    }
  }
}

export function insert(el, parentContainer) {
  parentContainer.append(el);
}

export function remove(child) {
  const parent = child.parentNode

  if (parent) {
    parent.removeChild(child)
  }
}

export function setChildren(el, children) {
  el.textContent = children
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setChildren,
});

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from "../runtime-core/index";