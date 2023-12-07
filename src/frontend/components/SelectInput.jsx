// Importing necessary components from Material-UI
import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Functional component for a select input field
const SelectInput = ({ label, name, value, onChange, required, options }) => {
  return (
    <FormControl fullWidth variant="outlined">
      {/* Label for the select input */}
      <InputLabel>{label}</InputLabel>
      {/* Select component for the dropdown menu */}
      <Select name={name} value={value} onChange={onChange} required={required}>
        {/* Default placeholder option */}
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {/* Mapping over the provided options to create menu items */}
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

// Exporting the SelectInput component
export default SelectInput;
