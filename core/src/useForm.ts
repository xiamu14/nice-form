import { useCallback, useEffect, useRef } from "react";
import pubSub from "./pub-sub";

export default function useForm() {
  const valuesRef = useRef<any>(undefined);
  const errorsRef = useRef<any>();
  const rulesRef = useRef<{ [k: string]: any[] }>();
  useEffect(() => {
    pubSub.subscribe("change", (field) => {
      console.log(
        "%c change",
        "color:white;background: rgb(83,143,204);padding:4px",
        field
      );
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

  const on = useCallback((name: string, callback) => {
    pubSub.subscribe(`on-${name}`, (data) => callback(data));
  }, []);

  const set = useCallback((name, fieldState) => {
    pubSub.publish(`set-${name}`, fieldState);
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
      pubSub.publish("reset");
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
