import { extend } from "../shared"

let activeEffect: any;
let shouldTrack: boolean

export class ReactiveEffect {
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

let targetMaps = new Map()
export function track(target: any, key: any) { 
  // target -> key -> dep
  if (!isTracking()) return

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

  trackEffects(dep)
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);

  activeEffect.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target: any, key: any) {
  const depMaps = targetMaps.get(target)
  const dep = depMaps.get(key)

  triggerEffects(dep)
}

export function triggerEffects(dep) {
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