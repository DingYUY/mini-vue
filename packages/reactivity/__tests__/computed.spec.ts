import { computed } from "../src/computed"
import { reactive } from "../src/reactive"
import { vi } from 'vitest'

describe('computed', () => { 
  it('happy path', () => {
    const user = reactive({
      age: 1
    })

    const computedUser = computed(() => {
      return user.age
    })

    expect(computedUser.value).toBe(1)
  })

  it('should compute lazily', () => {
    const user = reactive({
      age: 1,
    });

    const getter = vi.fn(() => {
      return user.age;
    });

    const computedUser = computed(getter);

    expect(getter).not.toHaveBeenCalled();

    expect(computedUser.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again when reactive value not changed
    computedUser.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should compute again when reactive value changed
    user.age = 2
    expect(computedUser.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    computedUser.value
    expect(getter).toHaveBeenCalledTimes(2);
  })
})