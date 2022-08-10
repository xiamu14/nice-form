# React Nice Form

<p align="center">
<img width="100" src="https://assets-phi.vercel.app/-/react-nice-form/logo.png"/>
</P>

<p align="center">
 <img src="https://img.shields.io/badge/coverage-100%25-brightgreen">
 <img src="https://img.shields.io/badge/min%20size-1%20kb-blue">
 <img src="https://img.shields.io/npm/dt/react-nice-form.svg?colorB=ff69b4">
 </p>

## 简介

表单场景是前端开发中最常见的场景。

表单的逻辑是定义输入组件，收集内容输入，校验输入内容，最后提交到服务器。通常复杂一点的还会有各个输入组件之间的联动，输入组件依赖异步数据等。

而这些逻辑浏览器只提供了基础的 API ，因此，原生开发有大量的样板代码来处理。`React Nice Form` 就是简化表单开发的利器。

## 上手案例

构建一个简单的登录表单组件。

<img width="500" src="https://assets-phi.vercel.app/-/react-nice-form/1.png" alt='login form/>

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

最外层的组件，接受一个 `FormType` 类型的对象，`FormType` 通过 `useForm` hook 函数返回。Form 组件内部实现了收集输入组件输入内容以及提交校验的功能。

| Props         | 类型                | 必填 | 用途                           |
| ------------- | ------------------- | ---- | ------------------------------ |
| form          | FormType            | 是   | 返回 Form 输入参数，校验结果等 |
| initialValues | Record<string, any> | 否   | 表单初始值（支持动态）         |
| defaultValues | Record<string, any> | 否   | 表单默认值（不支持动态）       |

FormType 类型

```ts
export interface FormType {
  setState: (name: string, fieldState: FieldStateType) => void;
  reset: () => void;
  setRules: (fieldRules: { [k: string]: RuleType }) => void;
  submit: () =>
    | {
        [x: string]: any;
      }
    | undefined;
}
```

| 属性     | 用途                                 |
| -------- | ------------------------------------ |
| setState | 修改输入组件状态                     |
| reset    | 重置表格                             |
| setRules | 设置输入校验规则                     |
| submit   | 提交表单、触发校验，返回表单输入内容 |

### Item

包裹输入组件，用于注册输入组件，通过传入的 `name` 属性。接受该输入组件值的校验方法（正则或函数）。

| Props    | 类型         | 必填 | 用途                       |
| -------- | ------------ | ---- | -------------------------- |
| name     | string       | 是   | 组件名、注册的唯一 ID      |
| rule     | RuleType     | 否   | 校验规则（正则或函数）     |
| verifyOn | VerifyOnType | 否   | 触发校验时机，失焦或输入时 |

## 进阶指南

### validator 校验

### 复杂联动

### 自定义输入

#### 异步数据源

#### 自增列表

### 使用第三方组件

### 注意事项

#### initialValues , defaultValues 差异
