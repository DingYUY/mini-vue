import { h, provide, inject } from "../../lib/mini-vue.esm.js"

const Provider = {
  name: "App",
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h("div", {}, [h("div", {}, "Provide"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "App",
  setup() {
    provide('foo', 'fooTwo')
    const foo = inject('foo')

    return {
      foo
    }
  },
  render() {
    return h("div", {}, [h("div", {}, "ProvideTwo: " + this.foo), h(Consumer)]);
  },
};

const Consumer = {
  name: 'Foo',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', () => 'bazDefault')

    return {
      foo,
      bar,
      baz
    }
  },
  render() {
    return h('div', {}, `Consumer foo: ${this.foo} ----- bar: ${this.bar} ---- baz: ${this.baz}`)
  }
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'injectApi'), h(Provider)])
  }
}
