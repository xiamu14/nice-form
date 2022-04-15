import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FormContext from "../context";
import pubSub from "../pub_sub";
import { RuleType, VerifyOnType } from "../types";
import { verifyUtil } from "../utils/verify";

interface Props {
  name: string;
  rule?: RuleType;
  verifyOn?: VerifyOnType;
}

const Field = (props: React.PropsWithChildren<Props>) => {
  const { children, name, rule, verifyOn } = props;
  const [value, setValue] = useState<any>();
  const [error, setError] = useState<string>();
  const [compProps, setCompProps] = useState<any>();

  const keyRef = useRef(name);

  const mountedRef = useRef<boolean>(false);
  const verifyOnRef = useRef<VerifyOnType>(verifyOn ?? "blur");
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
      if (rule) {
        // TODO: 这里做校验
        const result = verifyUtil(rule, value);
        console.log("debug verify", name, result);
        result.valid ? setError(undefined) : setError(result.message);
      }
    },
    [value]
  );

  useEffect(() => {
    pubSub.subscribe("reset", () => {
      if (name in context.defaultValues) {
        setValue(context.defaultValues[name]);
      } else {
        setValue(undefined);
      }
      setError(undefined);
    });
    pubSub.subscribe(`set-${keyRef.current}`, (fieldState) => {
      if ("value" in fieldState) {
        setValue(fieldState.value);
      }
      if ("compProps" in fieldState) {
        setCompProps(fieldState.compProps);
      }
      if ("error" in fieldState) {
        setError(fieldState.error);
      }
    });
    () => {
      pubSub.clearAllSubscriptions();
    };
  }, [context]);

  useEffect(() => {
    pubSub.publish("change", { [name]: value });
    pubSub.publish(`on-${keyRef.current}`, { value });
  }, [value]);

  useEffect(() => {
    if (context && rule) {
      context.setFieldRules({ [keyRef.current]: rule });
    }
  }, [context, rule]);

  useEffect(() => {
    if (context) {
      const startValues = {
        ...context.defaultValues,
        ...context.initialValues,
      };

      if (name in startValues) {
        console.log(
          "%c debug startValues",
          "background: #69c0ff; color: white; padding: 4px",
          startValues
        );
        setValue(startValues[name]);
      }
    }
  }, [context]);

  const bind = useCallback(
    (child: React.ReactNode) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      const childProps = {
        ...child.props,
        ...compProps,
        ...{
          value,
          error, // 校验结果
          onChange: (event: any) => {
            handleChange(keyRef.current, event);
          },
          onBlur: () => {
            verifyOnRef.current === "blur" && verify(keyRef.current);
            if ("onBlur" in child.props) {
              child.props.onBlur();
            }
          },
        },
      };
      return React.cloneElement(child, childProps);
    },
    [value, error, handleChange, verify]
  );

  return <div>{React.Children.map(children, bind)}</div>;
};

export default React.memo(Field);
