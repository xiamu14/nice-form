import { Subscriber } from "@redchili/pubsub";
import { useCallback, useEffect, useRef } from "react";
import { FieldStateType, ValuesType, FormType, RuleType } from "./types";
import pubSub from "./utils/pubsub";
import { verifyUtil } from "./utils/verify";

const subscriber = new Subscriber();

type EffectsAction = ({
  onValueChange,
  setState,
}: {
  onValueChange: (
    name: string | string[],
    callback: (data: {
      key: string;
      value: any;
      values: Record<string, any>;
    }) => void
  ) => void;
  setState: (name: string, fieldState: FieldStateType) => void;
}) => void;

interface FormProps {
  effects?: EffectsAction;
}

export default function useForm<T extends ValuesType>(props?: FormProps) {
  const valuesRef = useRef<T | undefined>(undefined);
  const hideFieldSRef = useRef<Set<string>>(new Set());
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: RuleType }>();
  const effectsRef = useRef<EffectsAction | undefined>(props?.effects);
  useEffect(() => {
    pubSub.subscribe("change", subscriber, (field) => {
      // NOTE: 存储值
      const result = { ...(valuesRef.current || {}), ...field };
      valuesRef.current = result as T;
    });
    pubSub.subscribe("hide", subscriber, (fieldName: string) => {
      // NOTE: 隐藏值
      hideFieldSRef.current.add(fieldName);
    });
    pubSub.subscribe("show", subscriber, (fieldName: string) => {
      // NOTE: 消失值
      hideFieldSRef.current.delete(fieldName);
    });
    pubSub.subscribe("verify", subscriber, (error) => {
      errorsRef.current = { ...(errorsRef.current || {}), ...error };
    });
    return () => {
      pubSub.unsubscribe();
    };
  }, []);

  const onValueChange = useCallback(
    (
      name: string | string[],
      callback: (data: {
        key: string;
        value: any;
        values: Record<string, any>;
      }) => void
    ) => {
      let keys: string[] = [];
      if (typeof name === "string") {
        keys = [name];
      } else {
        keys = name;
      }
      keys.forEach((key) => {
        pubSub.subscribe("onValueChange", subscriber, (data) => {
          const values = filterObject(
            valuesRef.current ?? {},
            hideFieldSRef.current
          );
          key === data.key && callback({ key, value: data.data.value, values });
        });
      });
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

  const form: FormType<T | undefined> = {
    // values: valuesRef.current,
    setState,
    reset: () => {
      pubSub.publish("reset", undefined);
    },
    setRules: (fieldRules: { [k: string]: RuleType }) => {
      // console.log("setRules", fieldRules);
      rulesRef.current = { ...rulesRef.current, ...fieldRules };
    },
    submit() {
      // TODO: 判断值是否都通过了校验，否则校验遗漏值；没有通过校验，触发消息给对应的 field
      // TODO: 校验是否都通过了
      let valid = true;
      // console.log(
      //   "%c debug",
      //   "color:white;background: rgb(83,143,204);padding:4px",
      //   hideFieldSRef.current,
      //   valuesRef.current
      // );
      const currentValue = filterObject(
        valuesRef.current ?? {},
        hideFieldSRef.current
      ) as T;
      if (rulesRef.current) {
        // console.log(
        //   "%c debug current",
        //   "color:white;background: rgb(83,143,204);padding:4px",
        //   currentValue
        // );
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
      return currentValue;
    },
  };

  const formRef = useRef(form);

  return { form: formRef.current };
}

function filterObject(value: ValuesType, keys: Set<string>) {
  const cloneValue = { ...value };
  keys.forEach((key) => {
    if (key in cloneValue) {
      delete cloneValue[key];
    }
  });
  return cloneValue;
}
