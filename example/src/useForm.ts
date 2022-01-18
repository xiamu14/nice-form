import { useState, useCallback, useEffect, useRef } from "react";
import PubSub from "pubsub-js";

export function useForm() {
  const valuesRef = useRef<any>(undefined);
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: any[] }>();
  useEffect(() => {
    PubSub.subscribe("change", (_, field) => {
      // NOTE: 存储值
      valuesRef.current = { ...(valuesRef.current || {}), ...field };
    });
    PubSub.subscribe("verify", (_, error) => {
      errorsRef.current = { ...(errorsRef.current || {}), ...error };
    });
    () => {
      PubSub.clearAllSubscriptions();
    };
  }, []);

  const on = useCallback((name: string, callback) => {
    PubSub.subscribe(`on-${name}`, (_, data) => callback(data));
  }, []);

  const set = useCallback((name, fieldState) => {
    PubSub.publish(`set-${name}`, fieldState);
  }, []);

  const effects = useCallback(
    (action: ({ on, set }: { on: any; set: any }) => void) => {
      action({ on, set });
    },
    [on, set]
  );

  const form = {
    values: valuesRef.current,
    reset: () => {
      PubSub.publish("reset");
    },
    setRules: (fieldRules: { [k: string]: any[] }) => {
      console.log("setRules", fieldRules);

      rulesRef.current = { ...rulesRef.current, ...fieldRules };
    },
    submit: async () => {
      // TODO: 判断值是否都通过了校验，否则校验遗漏值；没有通过校验，触发消息给对应的 field
      // TODO: 校验是否都通过了
      return valuesRef.current;
    },
  };

  return { form, effects };
}
