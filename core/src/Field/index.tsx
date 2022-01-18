import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import FormContext from "../context";
import pubSub from "../pub-sub";

interface Props {
  name: string;
  rules?: any[];
}

const Field = (props: React.PropsWithChildren<Props>) => {
  const { children, name, rules } = props;
  const [value, setValue] = useState<any>("");
  const [error, setError] = useState<string>();

  const keyRef = useRef(name);

  const mountedRef = useRef<boolean>(false);
  const context = useContext(FormContext);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const handleChange = (name: string, event: InputEvent | any) => {
    const value = event.target.value;
    setValue(value);
    pubSub.publish("change", { [name]: value });
  };

  const verify = useCallback(
    (name: string) => {
      console.log("debug rules", name, rules);
      if (rules) {
        console.log("debug rule", name, rules);
        setError("请输入xxx");
      }
    },
    [rules]
  );

  useEffect(() => {
    pubSub.subscribe("reset", () => {
      setValue("");
      setError(undefined);
    });
    pubSub.subscribe(`set-${keyRef.current}`, (fieldState) => {
      console.log("debug", fieldState);
      // TODO: 这里执行具体的联动逻辑
      if ("value" in fieldState) {
        console.log(
          "%c effect set",
          "background: #69c0ff; color: white; padding: 4px",
          fieldState
        );

        setValue(fieldState.value);
      }
    });
    () => {
      pubSub.clearAllSubscriptions();
    };
  }, []);

  useEffect(() => {
    pubSub.publish("change", { [name]: value });
    pubSub.publish(`on-${keyRef.current}`, { value });
  }, [value]);

  useEffect(() => {
    if (context && rules) {
      context.setFieldRules({ [keyRef.current]: rules });
    }
  }, [context, rules]);

  const bind = useCallback(
    (child: React.ReactNode) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      // console.log(child.props);

      console.log(
        "%c debug child.props",
        "background: #69c0ff; color: white; padding: 4px",
        child.props
      );

      const childProps = {
        ...child.props,
        ...{
          value,
          error, // 校验结果
          onChange: (event: any) => {
            handleChange(keyRef.current, event);
          },
          onBlur: () => {
            console.log("debug blur");
            verify(keyRef.current);
          },
        },
      };
      return React.cloneElement(child, childProps);
    },
    [value, error, handleChange, verify]
  );

  return <div>{React.Children.map(children, bind)}</div>;
};

export default Field;
