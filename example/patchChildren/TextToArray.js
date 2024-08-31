import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = "prevChildren";
const newChildren = [h("div", {}, [h("div", {}, "A"), h("div", {}, "B")])];

export const TextToArray = {
  setup() {
    const isChange = ref(false);

    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, newChildren)
      : h("div", {}, prevChildren);
  },
};
