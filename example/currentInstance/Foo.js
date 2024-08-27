import { h, renderSlots, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const Foo = {
  render() {
    const foo = h('div', { class: 'slot' }, 'foo 组件内容')

    // 具名插槽
    // 1.获取到要渲染的元素
    // 2.获取到要渲染的位置

    // 作用域插槽
    const age = 18
    return h('div', {}, [renderSlots(this.$slots, 'header', { age }), foo, renderSlots(this.$slots, 'footer')])
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo:", instance);
  },
};
