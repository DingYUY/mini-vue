export const extend = Object.assign;

export const EMPTY_OBJ = {}

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const handleKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
