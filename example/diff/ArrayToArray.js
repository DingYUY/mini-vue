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


// 老的比新的多 左侧对比    删除老的
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


// 老的比新的多 右侧对比    删除老的
// A B C D
// A B

// const prevChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
//   h("div", { key: "3" }, "C"),
//   h("div", { key: "4" }, "D"),
// ];
// const newChildren = [
//   h("div", { key: "3" }, "C"),
//   h("div", { key: "4" }, "D"),
// ]

// 处理中间的

// 老的比新的多

// A B C D E F
// A B E C F

// 根据key映射，查找， 时间复杂度 O(1)

// 新的 没有 删除， 老比新多超出索引全部删除

// const prevChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
//   h("div", { key: "3", id: 'pre-node' }, "C"),
//   h("div", { key: "4" }, "E"),
//   h("div", { key: "5" }, "D"),
//   h("div", { key: "6" }, "F"),
// ];
// const newChildren = [
//   h("div", { key: "1" }, "A"),
//   h("div", { key: "2" }, "B"),
//   h("div", { key: "4" }, "E"),
//   h("div", { key: "3", id: "next-node" }, "C"),
//   h("div", { key: "6" }, "F"),
// ];

// 移动

// a b (c d e) f  2 3 4   0 1 2
// a b (e c d) f  4 2 3  1 2 0

// 最长递增子序列 -> 计算不需移动的节点，提高性能

const prevChildren = [
  h("div", { key: "1" }, "A"),
  h("div", { key: "2" }, "B"),
  h("div", { key: "3" }, "C"),
  h("div", { key: "4" }, "D"),
  h("div", { key: "5" }, "E"),
  h("div", { key: "6" }, "F"),
  h("div", { key: "7" }, "G"),
  h("div", { key: "8" }, "H"),
  h("div", { key: "9" }, "M"),
]
const newChildren = [
  h("div", { key: "1" }, "A"),
  h("div", { key: "2" }, "B"),
  h("div", { key: "5" }, "E"),
  h("div", { key: "3" }, "C"),
  h("div", { key: "4" }, "D"),
  h("div", { key: "10" }, "N"),
  h("div", { key: "9" }, "M"),
];

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
