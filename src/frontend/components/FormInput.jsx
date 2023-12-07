// Importing necessary components and functions from React and Material-UI
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

// Importing custom input components
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import RadioGroupInput from "./RadioGroupInput";
import DateInput from "./DateInput";

// Functional component for the form
const FormInput = ({ onSubmit }) => {
  // State variables for form input values and UI feedback
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, setNotification] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  // useEffect to reset form values on component mount
  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setGender("");
    setAge("");
    setCountry("");
    setBio("");
    setSelectedDate(null);
    setNotification("email");
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Event handler for text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update state based on the input field name
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "age") {
      setAge(value);
    } else if (name === "country") {
      setCountry(value);
    } else if (name === "bio") {
      setBio(value);
    }
  };

  // Event handler to clear all form fields
  const handleClearAll = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setGender("");
    setAge("");
    setCountry("");
    setBio("");
    setSelectedDate(null);
    setNotification("email");
  };

  // Event handler for dropdown (Select) change
  const handleDropdownChange = (e) => {
    setGender(e.target.value);
  };

  // Event handler for notification preference change
  const handleNotificationChange = (e) => {
    setNotification(e.target.value);
  };

  // Event handler for date input change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sending form data to the server
      const response = await fetch("http://localhost:5002/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          gender,
          age,
          country,
          bio,
          selectedDate,
          notification,
        }),
      });

      // Handling the server response
      if (response.ok) {
        setIsSubmitting(false);
        setSnackbarOpen(true);
        onSubmit(); // Trigger parent component callback
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Event handler for Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Rendering the form with various input components
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Text input for First Name */}
        <Grid item xs={12} sm={6}>
          <TextInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* Text input for Last Name */}
        <Grid item xs={12} sm={6}>
          <TextInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* Text input for Email */}
        <Grid item xs={12}>
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* Dropdown (Select) input for Gender */}
        <Grid item xs={12} sm={6}>
          <SelectInput
            label="Gender"
            name="gender"
            value={gender}
            onChange={handleDropdownChange}
            required
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </Grid>
        {/* Text input for Age */}
        <Grid item xs={12} sm={6}>
          <TextInput
            label="Age"
            type="number"
            name="age"
            value={age}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* Text input for Country */}
        <Grid item xs={12} sm={6}>
          <TextInput
            label="Country"
            name="country"
            value={country}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* RadioGroup input for Notification Preference */}
        <Grid item xs={12} sm={6}>
          <RadioGroupInput
            label="Notification Preference"
            name="notification"
            value={notification}
            onChange={handleNotificationChange}
            options={[
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
            ]}
          />
        </Grid>
        {/* Date input for Date of Birth */}
        <Grid item xs={12} sm={6}>
          <DateInput
            label="Date of Birth"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </Grid>
        {/* Multiline text input for Bio */}
        <Grid item xs={12}>
          <TextInput
            label="Bio"
            multiline
            rows={4}
            name="bio"
            value={bio}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      {/* Submit button with loading spinner during submission */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: "20px" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          "Submit"
        )}
      </Button>
      {/* Button to clear all form fields */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        style={{ marginTop: "20px" }}
        onClick={handleClearAll}
      >
        Clear All
      </Button>
      {/* Snackbar for displaying form submission success message */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </form>
  );
};

// Exporting the FormInput component
export default FormInput;
