import { h, ref } from "../../lib/mini-vue.esm.js";

// 左侧
// A B C
// A B D E
// const prevChildren = [h("div", {key: '1'}, "A"), h("div", {key: '2'}, "B"), h("div", {key: '3'}, "C")]
// const newChildren = [
//     h("div", {key: '1'}, "A"),
//     h("div", {key: '2'}, "B"),
//     h("div", {key: '3'}, "D"),
//     h("div", {key: '4'}, "E"),
// ];

// 右侧
// A B C
// D E A B

// const prevChildren = [
//     h("div", { key: "1" }, "A"),
//     h("div", { key: "2" }, "B"),
//     h("div", { key: "3" }, "C"),
// ];
// const newChildren = [
//     h("div", { key: "4" }, "D"),
//     h("div", { key: "5" }, "E"),
//     h("div", { key: "2" }, "B"),
//     h("div", { key: "3" }, "C"),
// ];

// 新的比老的多 左侧     新增
// A B
// A B C D
// const prevChildren = [h("div", { key: "1" }, "A"), h("div", { key: "2" }, "B")];
// const newChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
//   h("div", { key: "3" }, "C"),
//   h("div", { key: "4" }, "D"),
// ];
// 新的比老的多 右侧    新增
// A B
// C D A B

// const prevChildren = [h("div", { key: "1" }, "A"), h("div", { key: "2" }, "B")];
// const newChildren = [
//   h("div", { key: "3" }, "C"),
//   h("div", { key: "4" }, "D"),
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
// ];


// 老的比新的多 左侧    删除老的
// A B C D
// A B

// const prevChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
//   h("div", { key: "3" }, "C"),
//   h("div", { key: "4" }, "D"),
// ];
// const newChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
// ];


// 老的比新的多 右侧    删除老的
// A B C D
// A B

const prevChildren = [
  h("div", { key: "1" }, "A"),
  h("div", { key: "2" }, "B"),
  h("div", { key: "3" }, "C"),
  h("div", { key: "4" }, "D"),
];
const newChildren = [
  h("div", { key: "3" }, "C"),
  h("div", { key: "4" }, "D"),
]



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
