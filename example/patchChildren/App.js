import { h, ref } from "../../lib/mini-vue.esm.js";

import { ArrayToText } from './ArrayToText.js'
import { TextToText } from './TextToText.js'
import { TextToArray } from './TextToArray.js'
import { ArrayToArray } from './ArrayToArray.js'

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [
      h("div", {}, "主页"),
      // h(ArrayToText),
      // h(TextToText),
      h(TextToArray),
      // h(ArrayToArray)
    ]);
  },
};
