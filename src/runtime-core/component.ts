export function createComponentInstance(vnode) { 
  const component = {
    vnode,
    type: vnode.type,
  }

  return component
}

export function setupComponent(instance, container) { 
  // TODO initProps
  // TODO initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  const { setup } = Component

  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // 如果是返回的是一个函数的话，我们就认为这是组件的render函数
  // 如果是一个对象的话，就将返回的对象注入到当前组件上下文中

  // TODO function

  // object
  if (typeof instance === 'object') {
    instance.setupState = setupResult
  }

  // 一定要保证组件的render是有值的
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  if (Component.render) {
    instance.render = Component.render
  }
}

