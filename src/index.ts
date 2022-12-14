import React from "react";

export { default as Form } from "./Form";
export { default as Item } from "./Item";
export { default as useForm } from "./useForm";

export declare type FieldChildType<V, T> = React.MemoExoticComponent<
  (
    props: {
      value?: V;
      onChange?: (value: V) => void;
      onBlur?: () => void;
      error?: string;
    } & T
  ) => JSX.Element
>;
