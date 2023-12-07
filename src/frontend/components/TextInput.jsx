// Importing necessary components from React and Material-UI
import React from "react";
import { TextField } from "@mui/material";

// Functional component for a text input field
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

// Exporting the TextInput component
export default TextInput;
