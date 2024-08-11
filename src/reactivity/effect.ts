class ReactiveEffect {
  private _fn: any

  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
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
  const _effect = new ReactiveEffect(fn)
  _effect.run()

  return _effect.run.bind(_effect)
}