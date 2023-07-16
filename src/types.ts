/**
 * @description 规则校验类型
 */
export type RuleType =
  | {
      regexp: RegExp;
      message?: string;
    }
  | ((value: any) => string)
  | { required: string };

export type VerifyOnType = "blur" | "change";

export type ValueType =
  | string
  | number
  | boolean
  | Record<string | number | symbol, unknown>
  | unknown[];

export type ValuesType = Record<string, ValueType>;

export interface FieldStateType {
  value?: any;
  props?: Record<string, any>;
  visible?: boolean;
  error?: string;
}

export interface FormType {
  setState: (name: string, fieldState: FieldStateType) => void;
  reset: () => void;
  setRules: (fieldRules: { [k: string]: RuleType }) => void;
  submit: () =>
    | {
        [x: string]: any;
      }
    | undefined;
}
