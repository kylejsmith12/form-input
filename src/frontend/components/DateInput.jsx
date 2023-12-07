// Import necessary components from Material-UI library
import React from "react";
import { TextField, FormControl, InputLabel } from "@mui/material";

// Functional component for a date input field
const DateInput = ({ label, value, onChange, required }) => {
  return (
    // Wrap the date input field in a FormControl for styling and layout control
    <FormControl fullWidth>
      {/* Date input field using Material-UI TextField */}
      <TextField
        type="date" // Set the input type to date for date selection
        variant="outlined" // Use outlined variant for styling
        fullWidth // Take full width of the parent container
        value={value} // Set the value of the input field
        onChange={(e) => onChange(e.target.value)} // Handle change event by calling the provided onChange function
        required={required} // Set whether the field is required based on the 'required' prop
      />
    </FormControl>
  );
};

// Export the DateInput component for use in other files
export default DateInput;
