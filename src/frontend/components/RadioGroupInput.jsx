// Importing necessary components from Material-UI
import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// Functional component for a radio button group input
const RadioGroupInput = ({ label, name, value, onChange, options }) => {
  return (
    <FormControl component="fieldset">
      {/* Label for the radio group */}
      <FormLabel component="legend">{label}</FormLabel>
      {/* RadioGroup component to contain individual radio buttons */}
      <RadioGroup row name={name} value={value} onChange={onChange}>
        {/* Mapping over the provided options to create radio buttons */}
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color="primary" />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

// Exporting the RadioGroupInput component
export default RadioGroupInput;
