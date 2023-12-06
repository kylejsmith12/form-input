// src/components/TextInput.jsx
import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({ label, name, value, onChange, required, type }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
    />
  );
};

export default TextInput;
