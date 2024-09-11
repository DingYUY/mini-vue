import { isReadonly, shallowReadonly, isProxy } from "../src/reactive";
import { vi } from "vitest";


describe('shallowReadonly', () => {
  it('happy path', () => {
    const original = {
      foo: 1,
      prop: {
        bar: 2
      }
    }
    const observed = shallowReadonly(original)
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.prop)).toBe(false)

    expect(isProxy(observed)).toBe(true)
  })

  it("should call console.warn when set", () => {
    console.warn = vi.fn();

    const user = shallowReadonly({ foo: 1 });

    user.foo = 2;
    expect(console.warn).toHaveBeenCalled();
  });
})