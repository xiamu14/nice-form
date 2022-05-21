import { Input as NiceInput } from "@react-nice-form/antd";
import "antd/dist/antd.css";
import { memo, useRef, useState } from "react";
import { Form, Item, useForm } from "react-nice-form";
import "./App.css";
const Input = memo(
  ({
    label,
    error,
    placeholder,
    value,
    style,
    ...rest
  }: {
    label?: string;
    value?: string;
    onChange?: (e: any) => void;
    error?: string;
    placeholder?: string;
    style?: React.CSSProperties;
  }) => {
    console.log("value", value, rest);
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
  const renderCount = useRef(0);
  const { form } = useForm({
    effects: ({ onValueChange, setState }) => {
      onValueChange("nickname", ({ value }: { value: any }) => {
        value === "英姿" &&
          setState("gender", {
            value: "女",
            props: { placeholder: "test" },
          });
        value === "消失"
          ? setState("gender", {
              visible: false,
            })
          : setState("gender", {
              visible: true,
            });
      });
    },
  });

  const handleSubmit = async () => {
    const values = form.submit();
    console.log(
      "%c values",
      "background: #69c0ff; color: white; padding: 4px",
      values
    );
  };

  const [initialValues] = useState({ nickname: "test" });

  renderCount.current += 1;

  return (
    <div className="App">
      <span className="counter">Render Count: {renderCount.current}</span>
      <div>
        <Form form={form} initialValues={initialValues}>
          <Item name="nickname">
            <Input label="昵称：" />
          </Item>
          <Item name="gender" rule={{ required: "请输入性别" }}>
            <Input label="性别："></Input>
          </Item>
          <Item name="test">
            <NiceInput label="test" />
          </Item>
        </Form>
        <div className="btn-group">
          <button type="submit" onClick={handleSubmit}>
            提交
          </button>
          <button
            type="submit"
            onClick={() => {
              form.reset();
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
