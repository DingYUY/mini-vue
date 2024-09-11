import { reactive } from "../src/reactive"
import { effect, stop } from "../src/effect"
import { vi } from 'vitest'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 18
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(19)

    // update
    user.age++
    expect(nextAge).toBe(20)
  })

  it('should return runner when call effect', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    /** 
     * 1. 通过 effect 的第二个参数，在 options 中设置一个函数 scheduler
     * 1. effect第一次执行的时候执行fn，scheduler不会执行
     * 2. 当 响应式对象 update set 的时候， 不会执行fn, 执行scheduler
     * 3. 执行 runner 的时候，会再执行fn
    */
    let dummy: any
    let run: any
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)

    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy: any
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })

    expect(dummy).toBe(1)
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    // obj.prop = 3 // only set
    obj.prop++ // get + set
    expect(dummy).toBe(2)

    runner()
    obj.prop = 3
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    let dummy: any
    const obj = reactive({ prop: 1 })
    const onStop = vi.fn()
    const runner = effect(() => {
      dummy = obj.prop
    }, { onStop })

    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})