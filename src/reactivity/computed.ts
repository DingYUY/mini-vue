import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any
  private _lock: boolean = true
  private _effect: any
  private _value: any
  constructor(getter) {
    this._getter = getter

    this._effect = new ReactiveEffect(getter, () => {
      this._lock = true
    });
  }

  get value() {
    if (this._lock) {
      this._lock = false
      this._value = this._effect.run()
    }

    return this._value
  }
}

export function computed(getter) { 
  return new ComputedRefImpl(getter)
}