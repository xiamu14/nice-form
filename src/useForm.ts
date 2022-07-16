import { Subscriber } from "@redchili/pubsub";
import { useCallback, useEffect, useRef } from "react";
import { FieldStateType, FormType, RuleType } from "./types";
import pubSub from "./utils/pubsub";
import { verifyUtil } from "./utils/verify";

const subscriber = new Subscriber();

type EffectsAction = ({
  onValueChange,
  setState,
}: {
  onValueChange: (name: string, callback: any) => void;
  setState: (name: string, fieldState: FieldStateType) => void;
}) => void;

interface FormProps {
  effects?: EffectsAction;
}

export default function useForm(props?: FormProps) {
  const valuesRef = useRef<any>(undefined);
  const hideFieldSRef = useRef<string[]>([]);
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: RuleType }>();
  const effectsRef = useRef<EffectsAction | undefined>(props?.effects);
  useEffect(() => {
    pubSub.subscribe("change", subscriber, (field) => {
      // NOTE: 存储值
      valuesRef.current = { ...(valuesRef.current || {}), ...field };
    });
    pubSub.subscribe("hide", subscriber, (fieldName: string) => {
      // NOTE: 隐藏值
      hideFieldSRef.current = [...hideFieldSRef.current, fieldName];
    });
    pubSub.subscribe("show", subscriber, (fieldName: string) => {
      // NOTE: 消失值
      const index = hideFieldSRef.current.indexOf(fieldName);
      hideFieldSRef.current = hideFieldSRef.current.splice(index, 1);
    });
    pubSub.subscribe("verify", subscriber, (error) => {
      errorsRef.current = { ...(errorsRef.current || {}), ...error };
    });
    return () => {
      pubSub.unsubscribeAll();
    };
  }, []);

  const onValueChange = useCallback(
    (name: string, callback: (data: { value: any }) => void) => {
      pubSub.subscribe(
        "onValueChange",
        subscriber,
        (data) => name === data.key && callback(data.data)
      );
    },
    []
  );

  const setState = useCallback((name: string, fieldState: FieldStateType) => {
    pubSub.publish("setState", { key: name, fieldState });
  }, []);

  useEffect(() => {
    effectsRef.current?.({
      onValueChange,
      setState,
    });
  }, []);

  const form: FormType = {
    // values: valuesRef.current,
    setState,
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
            setState(key, { error: result.message });
          }
        });
        return valid ? currentValue : undefined;
      }
      return undefined;
    },
  };

  const formRef = useRef(form);

  return { form: formRef.current };
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
