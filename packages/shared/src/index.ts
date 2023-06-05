export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";

export const extend = Object.assign;

export const isArray = Array.isArray;

export const isFunction = (val) =>
  Object.prototype.toString.call(val).slice(8, -1) === "Function";

export const isNumber = (val) =>
  Object.prototype.toString.call(val).slice(8, -1) === "Number";

export const isString = (val) =>
  Object.prototype.toString.call(val).slice(8, -1) === "String";

// 判断对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key);

// 判断是不是整数
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== "NaN" &&
  key[0] !== "-" &&
  "" + parseInt(key as string, 10) === key;

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
