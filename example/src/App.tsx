import React, { memo, useEffect } from "react";
import "./App.css";
import Field from "./Field";
import Form from "./Form";
import { useForm } from "./useForm";

const Input = memo(
  ({
    name,
    label,
    error,
    ...register
  }: {
    name: string;
    label?: string;
    value?: string;
    onChange?: (e: any) => void;
    error?: string;
  }) => {
    // console.log("check ", name);
    return (
      <div>
        <label>{label}</label>
        <input {...register} />
        <p>{error}</p>
      </div>
    );
  }
);

function App() {
  const { form, effects } = useForm();

  const handleSubmit = async () => {
    const values = await form.submit();
    console.log("debug values", values);
    form.reset();
  };

  useEffect(() => {
    effects(({ on, set }) => {
      on("nickname", ({ value }: { value: any }) => {
        console.log("debug nickname", value);
        set("gardener", { value: "12" });
      });
    });
  }, [effects]);

  return (
    <div className="App">
      <Form form={form}>
        <Field>
          <Input label="昵称：" name="nickname" />
        </Field>
        <Field
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input label="性别：" name="gardener"></Input>
        </Field>
      </Form>
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}

export default App;
