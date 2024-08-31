import { h, ref } from "../../lib/mini-vue.esm.js";

import { ArrayToArray } from './ArrayToArray.js'

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [
      h("div", {}, "主页"),
      h(ArrayToArray)
    ]);
  },
};
