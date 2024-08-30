import { h, ref } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);

    const onClick = () => {
      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    // 更新值
    const updateNewVal = () => {
      props.value.foo = "new-foo";
    };

    // 值为undefined删除
    const deleteWhenUndefined = () => {
      props.value.foo = undefined;
    };

    // 删除key直接删除
    const deleteWhenDeleteKey = () => {
      props.value = {
        foo: "foo",
      };
    };

    return {
      count,
      onClick,
      props,
      updateNewVal,
      deleteWhenUndefined,
      deleteWhenDeleteKey,
    };
  },
  render() {
    return h(
      "div",
      {
        ...this.props,
      },
      [
        h("div", {}, "count:" + this.count),
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
        h(
          "button",
          {
            onClick: this.updateNewVal,
          },
          "click-update-val"
        ),
        h(
          "button",
          {
            onClick: this.deleteWhenUndefined,
          },
          "click-val-undefined"
        ),
        h(
          "button",
          {
            onClick: this.deleteWhenDeleteKey,
          },
          "click-delete-key"
        ),
      ]
    );
  },
};
