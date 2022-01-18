import React, { useCallback, useEffect, useRef } from "react";
import FormContext from "../context";

interface Props {
  form: any;
  initialValues?: any;
}

const Form = React.memo(
  ({ children, form, initialValues }: React.PropsWithChildren<Props>) => {
    const setFieldRules = useCallback(
      (rule) => {
        form.setRules(rule);
      },
      [form]
    );
    return (
      <FormContext.Provider value={{ setFieldRules, initialValues }}>
        {children}
      </FormContext.Provider>
    );
  }
);

export default Form;
