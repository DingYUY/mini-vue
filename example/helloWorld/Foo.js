import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props) {
    // 1.访问props里面的count
    console.log('props', props)

    // 3.shallowReadonly
    props.count++
  },
  render() {
    // 2.this调用
    return h("div", {}, "foo：" + this.count);
  },
};
