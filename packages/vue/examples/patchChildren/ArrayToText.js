import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = [h('div', {}, [h('div', {}, 'A'), h('div', {}, 'B')])]
const newChildren = 'newChildren'

export const ArrayToText = {
  setup() {
    const isChange = ref(false);

    window.isChange = isChange;

    return {
      isChange
    }
  },
  render() {
    const self = this

    return self.isChange === true ? h('div', {}, newChildren) : h('div', {}, prevChildren)
  }
}