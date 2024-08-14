import { isReadonly, shallowReadonly } from "../reactive";


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
  })

  it("should call console.warn when set", () => {
    console.warn = jest.fn();

    const user = shallowReadonly({ foo: 1 });

    user.foo = 2;
    expect(console.warn).toHaveBeenCalled();
  });
})