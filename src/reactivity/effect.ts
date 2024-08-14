import { extend } from "../shared"

let activeEffect: any;
let shouldTrack: boolean
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
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

let rawMaps = new Map()
export function track(raw: any, key: any) { 
  // raw -> key -> dep
  if (!isTracking()) return

  let deptMaps = rawMaps.get(raw)
  if (!deptMaps) {
    deptMaps = new Map()
    rawMaps.set(raw, deptMaps)
  }

  let dep = deptMaps.get(key)
  if (!dep) {
    dep = new Set()
    deptMaps.set(key, dep)
  }

  if (dep.has(activeEffect)) return

  dep.add(activeEffect)

  activeEffect.deps.push(dep)
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(raw: any, key: any) {
  const depMaps = rawMaps.get(raw)
  const dep = depMaps.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

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