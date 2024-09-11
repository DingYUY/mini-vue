import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log('emit-add')
      emit('add', 1, 2)
    }
    const emitAddNoCamel = () => {
      console.log('emit-add')
      emit('add-no-camel', 1, 2)
    }

    return {
      emitAdd,
      emitAddNoCamel,
    };
  },
  render() {
    const addBtn = h("div", {}, [
      h(
        "button",
        {
          onClick: this.emitAdd,
        },
        "addBtn"
      ),
      h(
        "button",
        {
          onClick: this.emitAddNoCamel,
        },
        "emitAddNoCamel"
      ),
    ]);

    return addBtn
  },
};
