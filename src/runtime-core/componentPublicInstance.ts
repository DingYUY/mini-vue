// 可自由扩展 $data ...
const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el 
}

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (key in publicPropertiesMap) {
      return publicGetter(instance)
    }
  }
};
