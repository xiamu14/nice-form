import React, { memo, useEffect, useRef, useState } from "react";
import { NiceField, NiceForm, useForm } from "react-nice-form";
import "./App.css";

const Input = memo(
  ({
    label,
    error,
    placeholder,
    value,
    ...rest
  }: {
    label?: string;
    value?: string;
    onChange?: (e: any) => void;
    error?: string;
    placeholder?: string;
  }) => {
    console.log("placeholder ", label, placeholder);
    return (
      <div>
        <label>{label}</label>
        {/* FIXED: This is likely caused by the value changing from undefined to a defined value */}
        <input value={value ?? ""} {...rest} />
        {error && <p>{error}</p>}
      </div>
    );
  }
);

function App() {
  const form = useForm({
    effects: ({ onFieldValueChange, setFieldState }) => {
      onFieldValueChange("nickname", ({ value }: { value: any }) => {
        value === "英姿" &&
          setFieldState("gender", {
            value: "女",
            compProps: { placeholder: "test" },
          });
      });
    },
  });

  const formRef = useRef(form);

  const handleSubmit = async () => {
    const values = formRef.current.submit();
    console.log(
      "%c values",
      "background: #69c0ff; color: white; padding: 4px",
      values
    );
  };

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setInitialValues({ nickname: "test1231234" });
      formRef.current.setFieldState("nickname", {
        compProps: { placeholder: "逆臣" },
      });
    }, 2000);
  }, []);

  return (
    <div className="App">
      <NiceForm form={formRef.current} initialValues={initialValues}>
        <NiceField name="nickname">
          <Input label="昵称：" />
        </NiceField>
        <NiceField name="gender" rule={{ required: "请输入性别" }}>
          <Input label="性别："></Input>
        </NiceField>
        <button onClick={handleSubmit}>提交</button>
        <button
          onClick={() => {
            formRef.current.reset();
          }}
        >
          重置
        </button>
      </NiceForm>
    </div>
  );
}

export default App;
