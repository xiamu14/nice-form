import { Input } from "antd";
import React, { memo } from "react";

const InputProvider = memo(
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
    return (
      <div className="section">
        <label>{label}</label>
        <Input value={value ?? ""} {...rest} />
        {error && <p>{error}</p>}
      </div>
    );
  }
);

export default InputProvider;
