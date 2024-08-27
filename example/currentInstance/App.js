import { h, createTextVNode, getCurrentInstance } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: 'App',
  render() {
    const app = h("div", {}, "获取当前实例demo");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("p", {}, "header," + age),
          createTextVNode('好好好')
        ],
        footer: () => h("p", {}, "footer")
      }
    );

    return h("div", {}, [app, foo]);
  },

  setup() {
    const instance = getCurrentInstance()
    console.log('App:', instance)
  },
};
