// src/App.jsx
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

const theme = createTheme();

const App = () => {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState([]); // Store form data for table display

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormSubmit = (formDataItem) => {
    setFormData([...formData, formDataItem]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs value={value} onChange={handleTabChange} variant="standard">
          <Tab label="Form Input" />
          <Tab label="Table Display" />
        </Tabs>
      </AppBar>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: "40px", marginTop: "40px" }}>
          <TabPanel value={value} index={0}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Registration Form
            </Typography>
            <FormInput onSubmit={handleFormSubmit} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Form Data Table
            </Typography>
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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default App;
