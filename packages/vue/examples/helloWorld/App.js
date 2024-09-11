import { h } from "../../dist/mini-vue.esm.js";
import { Foo } from './Foo.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      "div",
      {
        id: "root",
        class: "bar",
        onClick: () => {
          console.log('click')
        },
        onMousedown: () => {
          console.log('mousedown')
        }
      },
      [h('div', {}, this.msg), h(Foo, { count: 1 })]
      // [
      //   h("p", { id: "p1", class: "p2 red" }, "mini-vue1"),
      //   h("span", { id: "span1", class: "blue" }, "mini-vue2"),
      // ]
    );
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
