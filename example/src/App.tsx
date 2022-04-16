import React, { memo, useRef, useState } from "react";
import { NiceField, NiceForm, useForm } from "react-nice-form";
import "./App.css";
let renderCount = 0;
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
      <div className="section">
        <label>{label}</label>
        {/* FIXED: This is likely caused by the value changing from undefined to a defined value */}
        <input value={value ?? ""} {...rest} />
        {error && <p>{error}</p>}
      </div>
    );
  }
);

function App() {
  renderCount++;
  const form = useForm({
    effects: ({ onFieldValueChange, setFieldState }) => {
      onFieldValueChange("nickname", ({ value }: { value: any }) => {
        value === "英姿" &&
          setFieldState("gender", {
            value: "女",
            compProps: { placeholder: "test" },
          });
        value === "消失"
          ? setFieldState("gender", {
              visible: false,
            })
          : setFieldState("gender", {
              visible: true,
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

  const [initialValues] = useState({ nickname: "test" });

  return (
    <div className="App">
      <span className="counter">Render Count: {renderCount}</span>
      <div>
        <NiceForm form={formRef.current} initialValues={initialValues}>
          <NiceField name="nickname">
            <Input label="昵称：" />
          </NiceField>
          <NiceField name="gender" rule={{ required: "请输入性别" }}>
            <Input label="性别："></Input>
          </NiceField>
        </NiceForm>
        <div className="btn-group">
          <button type="submit" onClick={handleSubmit}>
            提交
          </button>
          <button
            type="submit"
            onClick={() => {
              formRef.current.reset();
            }}
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
