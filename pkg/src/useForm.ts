import { useCallback, useEffect, useRef } from "react";
import pubSub from "./pub_sub";
import { RuleType } from "./types";
import { verifyUtil } from "./utils/verify";

type EffectsAction = ({
  onFieldValueChange,
  setFieldState,
}: {
  onFieldValueChange: (name: string, callback: any) => void;
  setFieldState: (name: string, fieldState: any) => void;
}) => void;

interface FormProps {
  effects?: EffectsAction;
}

export default function useForm({ effects }: FormProps) {
  const valuesRef = useRef<any>(undefined);
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: RuleType }>();
  const effectsRef = useRef<EffectsAction | undefined>(effects);
  useEffect(() => {
    pubSub.subscribe("change", (field) => {
      // NOTE: 存储值
      valuesRef.current = { ...(valuesRef.current || {}), ...field };
    });
    pubSub.subscribe("verify", (error) => {
      errorsRef.current = { ...(errorsRef.current || {}), ...error };
    });
    () => {
      pubSub.clearAllSubscriptions();
    };
  }, []);

  const onFieldValueChange = useCallback((name: string, callback) => {
    pubSub.subscribe(`on-${name}`, (data) => callback(data));
  }, []);

  const setFieldState = useCallback((name, fieldState) => {
    pubSub.publish(`set-${name}`, fieldState);
  }, []);

  useEffect(() => {
    effectsRef.current?.({
      onFieldValueChange,
      setFieldState,
    });
  }, []);

  const form = {
    values: valuesRef.current,
    setFieldState,
    reset: () => {
      pubSub.publish("reset");
    },
    setRules: (fieldRules: { [k: string]: RuleType }) => {
      // console.log("setRules", fieldRules);
      rulesRef.current = { ...rulesRef.current, ...fieldRules };
    },
    submit: () => {
      // TODO: 判断值是否都通过了校验，否则校验遗漏值；没有通过校验，触发消息给对应的 field
      // TODO: 校验是否都通过了
      let valid = true;
      console.log(
        "%c debug",
        "color:white;background: rgb(83,143,204);padding:4px",
        rulesRef.current,
        valuesRef.current
      );
      if (rulesRef.current) {
        Object.keys(rulesRef.current).forEach((key) => {
          const verify = rulesRef.current?.[key];

          const value =
            key in valuesRef.current ? valuesRef.current[key] : undefined;
          const result = verifyUtil(verify as RuleType, value);
          console.log(
            "%c debug verify",
            "color:white;background: rgb(83,143,204);padding:4px",
            value
          );
          if (!result.valid) {
            valid = false;
            setFieldState(key, { error: result.message });
          }
        });
      }
      return valid ? valuesRef.current : undefined;
    },
  };

  return form;
}
