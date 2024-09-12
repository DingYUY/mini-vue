import { ReactiveEffect } from "@mini-vue/reactivity";
import { queuePreFlushCb } from "./scheduler";

export function watchEffect(source: any) {
  function job() {
    effect.run();
  }

  let cleanup
  const onCleanup = function (fn) {
    cleanup = effect.onStop = () => {
      fn()
    }
  };
  function getter() {
    if (cleanup) {
      cleanup()
    }

    source(onCleanup);
  }

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushCb(job);
  });

  effect.run();

  return () => {
    effect.stop();
  };
}