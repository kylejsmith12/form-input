// Importing necessary components and functions from React and Material-UI
import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Container,
  Paper,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FormInput from "./components/FormInput";
import TableDisplay from "./components/TableDisplay";

// Creating a Material-UI theme
const theme = createTheme();

// Main application component
const App = () => {
  // State variables for managing the selected tab and form data for table display
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState([]);

  // Event handler for tab changes
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Callback function to handle form submissions and update form data
  const handleFormSubmit = (formDataItem) => {
    setFormData([...formData, formDataItem]);
  };

  // Rendering the main application structure with Material-UI components
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AppBar for navigation tabs */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        {/* Tabs for navigating between form input and table display */}
        <Tabs value={value} onChange={handleTabChange} variant="standard">
          <Tab label="Form Input" />
          <Tab label="Table Display" />
        </Tabs>
      </AppBar>
      {/* Main content container */}
      <Container component="main" maxWidth="md">
        {/* Paper component for a card-like appearance */}
        <Paper elevation={3} style={{ padding: "40px", marginTop: "40px" }}>
          {/* TabPanel for the Form Input tab */}
          <TabPanel value={value} index={0}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Registration Form
            </Typography>
            {/* FormInput component for user registration */}
            <FormInput onSubmit={handleFormSubmit} />
          </TabPanel>
          {/* TabPanel for the Table Display tab */}
          <TabPanel value={value} index={1}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Form Data Table
            </Typography>
            {/* TableDisplay component for displaying form data in a table */}
            <TableDisplay data={formData} />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

// A helper function to create a TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {/* Display the content only for the selected tab */}
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

// Exporting the main App component
export default App;
