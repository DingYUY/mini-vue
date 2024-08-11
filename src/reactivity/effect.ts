import { extend } from "../shared"

class ReactiveEffect {
  private _fn: any
  public scheduler?: Function | undefined
  deps = []
  active = true
  onStop?: () => void

  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }
  stop() {
    if (!this.active) return
    if (this.onStop) {
      this.onStop()
    }
    cleanupEffect(this)
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

let targetMaps = new Map()
export function track(target: any, key: any) { 
  // target -> key -> dep
  let deptMaps = targetMaps.get(target)
  if (!deptMaps) {
    deptMaps = new Map()
    targetMaps.set(target, deptMaps)
  }

  let dep = deptMaps.get(key)
  if (!dep) {
    dep = new Set()
    deptMaps.set(key, dep)
  }

  dep.add(activeEffect)

  if (!activeEffect) return

  activeEffect.deps.push(dep)
}

export function trigger(target: any, key: any) {
  const depMaps = targetMaps.get(target)
  const dep = depMaps.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect: any
export function effect(fn, options: any = {}) {

  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}