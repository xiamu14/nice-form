# React Nice Form

![LOGO](https://assets-phi.vercel.app/-/react-nice-form/logo.png){:height="100px" width="100px"}

## 简介

表单场景是前端开发中最常见的场景。

表单的逻辑是定义输入组件，收集内容输入，校验输入内容，最后提交到服务器。通常复杂一点的还会有各个输入组件之间的联动，输入组件依赖异步数据等。

而这些逻辑浏览器只提供了基础的 API ，因此，原生开发有大量的样板代码来处理。`React Nice Form` 就是简化表单开发的利器。

## 上手案例

构建一个简单的登录表单组件。

![login form](https://assets-phi.vercel.app/-/react-nice-form/1.png)

```tsx
import { Form, Item, useForm } from "react-nice-form";
import { Button, Spacer } from "@nextui-org/react";
import CustomInput from "../custom_input";

const LoginForm = () => {
  const { form } = useForm();

  const handleSubmit = () => {
    const values = form.submit();

    console.log(values);
  };

  return (
    <div>
      <Form form={form}>
        <Item name="nickname">
          <CustomInput
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Nickname"
          />
        </Item>
        <Item name="email">
          <CustomInput
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Email"
          />
        </Item>
      </Form>
      <Spacer />
      <Button auto onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default LoginForm;
```

`custom_input.tsx` 代码如下：

```tsx
import { Input, InputProps } from "@nextui-org/react";

interface Props extends Partial<Omit<InputProps, "onChange">> {
  onChange?: (value: string) => void;
}

const CustomInput = ({ onChange, value, ...restProps }: Props) => {
  return (
    <Input
      {...restProps}
      value={value ?? ""}
      onChange={(e) => {
        onChange?.(e.currentTarget.value);
      }}
    />
  );
};

export default CustomInput;
```

真实效果点击 [demo](https://codesandbox.io/s/eager-driscoll-fr4hw1?file=/src/components/custom_input/index.tsx:0-419)。

## 基础组件

### Form

### Item

## 进阶指南

### validator 校验

### 复杂联动

### 自定义输入

#### 异步数据源

#### 自增列表

### 连接 UI 组件
