import { extend, isObject } from "@mini-vue/shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true)
const readonlySet = createReadonlySetter()
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(raw, key) {
    if (key === ReactiveFlags.IS_REACTIVE) { 
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly 
    }

    const res = Reflect.get(raw, key);

    if (isShallowReadonly) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      // 收集依赖
      track(raw, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(raw, key, value) {
    const res = Reflect.set(raw, key, value);

    // 触发依赖
    trigger(raw, key);
    return res;
  };
}

function createReadonlySetter() {
  return function set(raw, key, value) {
    console.warn(`属性 ${key} 是只读属性`, raw)
    return true;
  };
}

export const mutableHandlers = {
  get,
  set
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});