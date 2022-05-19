import { useCallback, useEffect, useRef } from "react";
import { FieldStateType, FormType, RuleType } from "./types";
import pubSub from "./utils/pubsub";
import { verifyUtil } from "./utils/verify";

type EffectsAction = ({
  onFieldValueChange,
  setFieldState,
}: {
  onFieldValueChange: (name: string, callback: any) => void;
  setFieldState: (name: string, fieldState: FieldStateType) => void;
}) => void;

interface FormProps {
  effects?: EffectsAction;
}

export default function useForm({ effects }: FormProps) {
  const valuesRef = useRef<any>(undefined);
  const hideFieldSRef = useRef<string[]>([]);
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: RuleType }>();
  const effectsRef = useRef<EffectsAction | undefined>(effects);
  useEffect(() => {
    pubSub.subscribe("change", (field) => {
      // NOTE: 存储值
      valuesRef.current = { ...(valuesRef.current || {}), ...field };
    });
    pubSub.subscribe("hide", (fieldName: string) => {
      // NOTE: 隐藏值
      hideFieldSRef.current = [...hideFieldSRef.current, fieldName];
    });
    pubSub.subscribe("show", (fieldName: string) => {
      // NOTE: 消失值
      const index = hideFieldSRef.current.indexOf(fieldName);
      hideFieldSRef.current = hideFieldSRef.current.splice(index, 1);
    });
    pubSub.subscribe("verify", (error) => {
      errorsRef.current = { ...(errorsRef.current || {}), ...error };
    });
    return () => {
      pubSub.unsubscribeAll();
    };
  }, []);

  const onFieldValueChange = useCallback(
    (name: string, callback: (data: { value: any }) => void) => {
      pubSub.subscribe(
        "onFieldValueChange",
        (data) => name === data.key && callback(data.data)
      );
    },
    []
  );

  const setFieldState = useCallback(
    (name: string, fieldState: FieldStateType) => {
      pubSub.publish("setFieldState", { key: name, fieldState });
    },
    []
  );

  useEffect(() => {
    effectsRef.current?.({
      onFieldValueChange,
      setFieldState,
    });
  }, []);

  const form: FormType = {
    // values: valuesRef.current,
    setFieldState,
    reset: () => {
      pubSub.publish("reset", undefined);
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
        const currentValue = filterObject(
          valuesRef.current,
          hideFieldSRef.current
        );
        console.log(
          "%c debug current",
          "color:white;background: rgb(83,143,204);padding:4px",
          currentValue
        );
        Object.keys(rulesRef.current).forEach((key) => {
          const verify = rulesRef.current?.[key];

          const value = key in currentValue ? currentValue[key] : undefined;
          const result = verifyUtil(verify as RuleType, value);

          if (!result.valid) {
            valid = false;
            setFieldState(key, { error: result.message });
          }
        });
        return valid ? currentValue : undefined;
      }
      return undefined;
    },
  };

  return form;
}

function filterObject(value: Record<string, any>, keys: string[]) {
  const cloneValue = { ...value };
  keys.forEach((key) => {
    if (key in cloneValue) {
      delete cloneValue[key];
    }
  });
  return cloneValue;
}