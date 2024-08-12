import { track, trigger } from "./effect";

const get = createGetter(false);
const set = createSetter();
const readonlyGet = createGetter(true)
const readonlySet = createReadonlySetter()

function createGetter(isReadonly) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    // 触发依赖
    trigger(target, key);
    return res;
  };
}

function createReadonlySetter() {
  return function set(target, key, value) {
    console.warn(`属性 ${key} 是只读属性`, target)
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