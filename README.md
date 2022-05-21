# react-nice-form

更容易使用的表单组件库

## 功能

1. 组件间状态隔离，避免无意义的 re-render
2. 非常容易实现表单组件间的联动
3. 强大的自定义校验，可以自由使用第三方的表单校验库
4. 只依赖 React，所以 Taro，React Native 等也可以无缝接入
5. UI 完全自定义，也可以灵活的接入第三方 UI 组件库

## 示例

```tsx
import { memo, useRef, useState } from "react";
import { Form, Item, useForm } from "react-nice-form";
import "./App.css";

// 自定义 Input 输入组件，增加 label，placeholder 等
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

  // 通过 useForm 获得 form 实例；其中添加 effects 联动
  // onValueChange 关联输入字段的值变化
  // setState 可以设置输入字段的 state，包括自定义组件的 props
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

  // 灵活的触发提交
  // 自动触发校验；校验失败，values 返回错误，并设置输入组件的状态
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
```
