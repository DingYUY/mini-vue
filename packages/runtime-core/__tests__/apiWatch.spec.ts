import { reactive } from "@mini-vue/reactivity";
import { nextTick } from "../src/scheduler";
import { watchEffect } from "../src/apiWatch";
import { vi } from "vitest";

describe("api: watch", () => { 
  it("effect", async () => {
    /* run before render */
    const state = reactive({ count: 0 })
    let dummy
    watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)

    state.count++
    // if not render component, you will find that value is not updated
    await nextTick()
    expect(dummy).toBe(1)
  })

  it("stopping the watcher (effect)", async () => {
    const state = reactive({ count: 0 })
    let dummy
    const stop: any = watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    stop()
    state.count++;
    await nextTick();
    expect(dummy).toBe(0);
  })

  it("cleanup registration (effect)", async () => { 
    const state = reactive({ count: 0 });
    const cleanup = vi.fn()
    let dummy;
    const stop: any = watchEffect((onCleanup) => {
      // 初始化时不调用 onCleanup
      onCleanup(cleanup)
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1);

    stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})