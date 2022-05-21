import React, { useCallback, useMemo, useRef } from "react";
import FormContext from "../context";

interface Props {
  form: any;
  initialValues?: any;
  defaultValues?: any;
}

const Form = React.memo(
  ({
    children,
    form,
    initialValues,
    defaultValues,
  }: React.PropsWithChildren<Props>) => {
    const defaultValuesRef = useRef(defaultValues ?? {});
    const formRef = useRef(form);

    const setFieldRules = useCallback((rule) => {
      formRef.current.setRules(rule);
    }, []);

    const contextValue = useMemo(() => {
      return {
        setFieldRules,
        initialValues,
        defaultValues: defaultValuesRef.current,
      };
    }, [initialValues]);

    // NOTE: 防止父组件导致的 children 重渲染
    const childrenMemorized = useMemo(() => {
      return children;
    }, []);

    return (
      <FormContext.Provider value={contextValue}>
        {childrenMemorized}
      </FormContext.Provider>
    );
  }
);

export default Form;
