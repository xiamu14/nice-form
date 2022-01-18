import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import FormContext from "../context";
import PubSub from "pubsub-js";

const watcher = { name: "" };

interface Props {
  rules?: any[];
}

const Field = (props: React.PropsWithChildren<Props>) => {
  const { children, rules } = props;
  const [value, setValue] = useState<any>("");
  const [error, setError] = useState<string>();
  const [name, setName] = useState<string>();
  const onceRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const context = useContext(FormContext);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  //   FIXME: 似乎勉强可以使用；但看起来不是很常规啊
  //   NOTE: useEffect 里包裹后，defineProperty 劫持失败
  //   useEffect(() => {
  if (!mountedRef.current) {
    Object.defineProperty(watcher, "name", {
      set(value) {
        if (!onceRef.current) {
          setName(value);
          onceRef.current = true;
        }
      },
    });
  }
  //   }, []);

  const handleChange = (name: string, event: InputEvent | any) => {
    const value = event.target.value;
    setValue(value);
    PubSub.publish("change", { [name]: value });
  };

  const verify = useCallback(
    (name: string) => {
      console.log("debug rules", rules);
      if (rules) {
        console.log("debug rule", rules);
        setError("请输入xxx");
      }
    },
    [rules]
  );

  useEffect(() => {
    PubSub.subscribe("reset", () => {
      setValue("");
      setError(undefined);
    });
    () => {
      PubSub.clearAllSubscriptions();
    };
  }, []);

  useEffect(() => {
    if (name) {
      PubSub.subscribe(`set-${name}`, (_, fieldState) => {
        console.log("debug", fieldState);
        // TODO: 这里执行具体的联动逻辑
        if ("value" in fieldState) {
          setValue(fieldState.value);
        }
      });
    }
  }, [name]);

  useEffect(() => {
    if (name) {
      console.log("debug onEffect", name, value);
      PubSub.publish(`on-${name}`, { value });
    }
  }, [name, value]);

  useEffect(() => {
    if (name && context && rules) {
      context.setFieldRules({ name: rules });
    }
  }, [name, context, rules]);

  const bind = useCallback(
    (child: React.ReactNode) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      // NOTE: 判断子组件的 props 里 name 字段
      const name = child.props.name;
      console.log("debug name", name);
      if (name) {
        watcher.name = name;
        const childProps = {
          ...child.props,
          ...{
            value,
            error, // 校验结果
            onChange: (event: any) => {
              handleChange(name, event);
            },
            onBlur: () => {
              console.log("debug blur");
              verify(name);
            },
          },
        };
        return React.cloneElement(child, childProps);
      }
      return React.cloneElement(child);
    },
    [value, error, handleChange, verify]
  );

  return <div>{React.Children.map(children, bind)}</div>;
};

export default Field;
