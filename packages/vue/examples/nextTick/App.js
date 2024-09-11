import { h, ref, nextTick, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const App = {
  setup() {
    const count = ref(1);

    const instance = getCurrentInstance()
    // 发现视图渲染了100次
    // 优化： 要求视图只渲染一次
    // 方法： 将视图更新转为异步，放入微任务中执行

    const onClick = () => {
      for (let i = 0; i < 100; i++) {
        console.log('update')
        count.value = i;
      }
      console.log(instance)
      nextTick(() => {
        console.log('nextTick---', instance)
      })
    };


    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", {}, [
      h("button", { onClick: this.onClick }, "click"),
      h("p", {}, "count: " + this.count),
    ]);
  },
};
