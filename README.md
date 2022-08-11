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

特点：

- 减少样板代码
- 避免 React re-render
- 快捷的设置校验和联动
- 灵活自定义输入组件

## 安装

```
$ yarn add react-nice-form

# or via pnpm

$ pnpm add react-nice-form

# or via npm
$ npm install --save react-nice-form
```

## 上手案例

构建一个简单的登录表单组件。

<p align="center" style="border: 1px solid #dddddd;">
<img width="500" src="https://assets-phi.vercel.app/-/react-nice-form/1.png" alt="login form"/>
</p>

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
  error?: string;
}

const CustomInput = ({ onChange, value, ...restProps }: Props) => {
  return (
    <div>
      <Input
        {...restProps}
        value={value ?? ""}
        onChange={(e) => {
          onChange?.(e.currentTarget.value);
        }}
      />
      {error}
    </div>
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

校验方式支持正则，required，函数三种类型。在 Item 里设置校验方式和校验触发时机，当校验未通过时，输入组件可以同从 props 的 error 参数里获取到错误信息，用于提示。案例代码如下:

```
...
<Item name="nickname" rule={{ required: "Please input Nickname" }}>
  <CustomInput
    clearable
    bordered
    fullWidth
    color="primary"
    size="lg"
    label="Nickname"
  />
</Item>
...
```

当输入组件校验没有全部通过时， form.submit 将无法提交，submit 函数返回 `undefined`。

### 复杂联动

输入组件间的联动目前只支持比较简单的监听输入事件时改变其他输入组件的状态（包括 value，hide/show，props）。Form 生命周期的监听事件在计划开发中。

将 nickname 的输入同时设置为 email 的输入，具体实现代码如下：

```tsx
...
const { form } = useForm({
  effects: ({ onValueChange, setState }) => {
    onValueChange("nickname", ({ value }: any) => { // 监听 nickname 变动
      setState("email", { value }); // 设置为 email 的 value
    });
  }
});
```

### 自定义输入

`React-Nice-Form` 很容易连接自定义的输入组件，只要输入组件的 props 定义 `value`, `onChange` 属性即可。

参考`上手案例`里的 `custom_input.tsx`。

因此，一些复杂的自增输入组件，完全由输入组件本身控制自增逻辑，复用率更高。

### 使用第三方组件

上手案例里使用的是 NextUI 组件库的 Input，举一反三，类似 Antd Design 等 UI 库，都可以简单封装后使用。

### 注意事项

#### initialValues , defaultValues 差异

- initialValues 是表单的初始值，所有必填输入组件都必须有值。常用于表单编辑初始化时传入，支持异步数据。
- defaultValues 是表单部分输入组件的默认设置值，比如使用当前时间，当前地址作为默认值。
- initialValues 的优先级高于 defaultValues，当两者同时设置时，使用 initialValues。
- form.reset 调用后，表单目前恢复是到 defaultValues。（后续计划可以灵活调整 reset 恢复的状态值）

### TODO

- [ ] 联动监听 Form 生命周期事件
- [ ] reset 可以自由设置恢复到 initialValues 还是 defaultValues
- [ ] submit 后，如果校验未通过，返回所有字段的错误信息
