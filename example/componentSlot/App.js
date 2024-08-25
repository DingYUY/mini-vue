import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    const app = h("div", {}, "div.app");
    const foo = h(
      Foo,
      {},
      {
        header: ({age}) => h("p", {}, "header," + age),
        footer: () => h("p", {}, "footer")
      }
    );

    return h("div", {}, [app, foo]);
  },

  setup() {},
};
