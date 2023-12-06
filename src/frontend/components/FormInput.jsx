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
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import RadioGroupInput from "./RadioGroupInput";
import DateInput from "./DateInput";

const FormInput = ({ onSubmit }) => {
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

  useEffect(() => {
    // Reset form values when the component mounts
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleDropdownChange = (e) => {
    setGender(e.target.value);
  };

  const handleNotificationChange = (e) => {
    setNotification(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
            required
          />
        </Grid>
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
        <Grid item xs={12} sm={6}>
          <TextInput
            label="Country"
            name="country"
            value={country}
            onChange={handleInputChange}
            required
          />
        </Grid>
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
        <Grid item xs={12} sm={6}>
          <DateInput
            label="Date of Birth"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </Grid>
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
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        style={{ marginTop: "20px" }}
        onClick={handleClearAll}
      >
        Clear All
      </Button>
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

export default FormInput;
