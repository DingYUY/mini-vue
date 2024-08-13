import { readonly, isReadonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)

    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  })

  it('warn when call set', () => {
    console.warn = jest.fn()

    const user = readonly({ foo: 1 })

    user.foo = 2
    expect(console.warn).toHaveBeenCalled()
  })
})