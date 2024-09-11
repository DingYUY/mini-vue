import { camelize, handleKey } from "@mini-vue/shared";

export function emit(instance, event, ...args) {

  const { props } = instance

  const handlerName = handleKey(camelize(event))
  
  const handler = props[handlerName];

  handler && handler(...args)
}