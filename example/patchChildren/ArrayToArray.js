import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = [h("div", {}, [h("div", {}, "A"), h("div", {}, "B")])];
const newChildren = [h("div", {}, [h("div", {}, "C"), h("div", {}, "D")])];

export const ArrayToArray = {
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
