import { ref } from "../../dist/mini-vue.esm.js";

export const App = {
  name: "App",
  template: `<div>hi,{{count}}</div>`,
  setup() {
    const msg = 'mini-vue';
    const count = (window.count = ref(1));
    return {
      count,
      msg,
    };
  },
};
