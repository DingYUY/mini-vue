import { h } from "../../lib/mini-vue.esm.js";

export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: "bar",
      },
      [
        h("p", { id: "p1", class: "p2 red" }, "mini-vue1"),
        h("span", { id: "span1", class: "blue" }, "mini-vue2"),
      ]
    );
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
