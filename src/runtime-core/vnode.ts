export function createVNode(type: any, props?, children?) {
  return {
    type,
    props,
    children,
    el: null,
  };
}
