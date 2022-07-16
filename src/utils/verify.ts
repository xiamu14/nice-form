import { RuleType } from "../types";
import { isFunction } from "./type_guard";
/**
 * @description 校验
 */

export const verifyUtil = (rule: RuleType, value: any) => {
  if (isFunction(rule)) {
    const message = rule(value);
    return { valid: !!message, message };
  }

  if ("required" in rule) {
    const valid = Array.isArray(value) ? !value.length : !!value;
    return { valid, message: rule.required };
  }

  const valid = rule.regexp.test(value);
  return { valid, message: rule.message };
};
