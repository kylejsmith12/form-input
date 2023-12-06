// src/components/DateInput.jsx
import React from "react";
import { TextField, FormControl, InputLabel } from "@mui/material";

const DateInput = ({ label, value, onChange, required }) => {
  return (
    <FormControl fullWidth>
      <TextField
        type="date"
        variant="outlined"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </FormControl>
  );
};

export default DateInput;
