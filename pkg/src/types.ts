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
