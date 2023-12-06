// src/components/SelectInput.jsx
import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SelectInput = ({ label, name, value, onChange, required, options }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} onChange={onChange} required={required}>
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
