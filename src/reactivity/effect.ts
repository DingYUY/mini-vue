class ReactiveEffect {
  private _fn: any

  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

let targetMaps = new Map()
export function track(target, key) { 
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

export function trigger(target, key) {
  const depMaps = targetMaps.get(target)
  const dep = depMaps.get(key)

  for (const effect of dep) {
    effect.run();
  }
}

let activeEffect
export function effect(fn) {
  const effect = new ReactiveEffect(fn)
  effect.run()
}