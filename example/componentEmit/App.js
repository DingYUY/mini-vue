import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: "bar",
      },
      [
        h("div", {}, this.msg),
        h(Foo, {
          // on + Event
          onAdd(a, b) {
            console.log("onAdd", a, b);
          },
          onAddNoCamel() {
            console.log("onAddNoCamel");
          }
        }),
      ]
    );
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
