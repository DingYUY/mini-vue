import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive(target) {
  return new Proxy(target, mutableHandlers)
}

export function readonly(target) {
  return new Proxy(target, readonlyHandlers);
}