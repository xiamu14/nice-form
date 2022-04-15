/**
 * @description 类型门卫函数
 */

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function isObject(value: any): value is Object {
  return Object.prototype.toString.call(value) === "[object Object]";
}
