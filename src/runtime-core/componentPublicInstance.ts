import { hasOwn } from "../shared";

// 可自由扩展 $data ...
const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el,
  $slots: (instance) => instance.slots
}

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key];
    if (key in publicPropertiesMap) {
      return publicGetter(instance)
    }
  }
};
