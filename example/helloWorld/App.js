import { h } from "../../lib/mini-vue.esm.js";

window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      "div",
      {
        id: "root",
        class: "bar",
      },
      'hi,' + this.msg
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
