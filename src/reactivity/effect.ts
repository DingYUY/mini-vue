class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
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
  const scheduler = options.scheduler

  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()

  return _effect.run.bind(_effect)
}