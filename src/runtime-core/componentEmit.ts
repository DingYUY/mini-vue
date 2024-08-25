import { camelize, handleKey } from "../shared";

export function emit(instance, event, ...args) {
  console.log('event', event)

  const { props } = instance
  
  const handler = props[handleKey(camelize(event))];

  handler && handler(...args)
}