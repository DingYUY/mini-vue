import { createRenderer } from "../runtime-core/renderer";


export function createElement(type) {
  return document.createElement(type);
}

export function patchProp(el, key, val) {
  // 例如 onClick ... 事件处理
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(el, parentContainer) {
  parentContainer.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from "../runtime-core/index";