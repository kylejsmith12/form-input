// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

// Creating an instance of the Express application
const app = express();
const port = process.env.PORT || 5002;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Creating a PostgreSQL pool for database connections
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "form-input-database",
  password: "postgres",
  port: 5432,
});

// Handling GET requests to the /api/getUserData endpoint
app.get("/api/getUserData", async (req, res) => {
  try {
    const { page, rowsPerPage, chunkSize = 25 } = req.query;
    const offset = (page - 1) * rowsPerPage; // Calculate the offset

    // Fetch the total count of rows
    const totalCount = await pool.query("SELECT COUNT(*) FROM user_data");
    const totalRows = totalCount.rows[0].count;

    // Fetch the subset of rows based on pagination and chunk size
    const result = await pool.query(
      "SELECT * FROM user_data ORDER BY id OFFSET $1 LIMIT $2",
      [offset, Math.min(chunkSize, rowsPerPage)]
    );
    const userData = result.rows;

    console.log(userData); // Log the data to inspect its structure
    res.json({ userData, totalRows });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling POST requests to the /api/submitForm endpoint
app.post("/api/submitForm", async (req, res) => {
  console.log("Received a request to /api/submitForm");
  const {
    firstName,
    lastName,
    email,
    gender,
    age,
    country,
    bio,
    selectedDate,
    notification,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO user_data (first_name, last_name, email, gender, age, country, bio, dob, notification) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        firstName,
        lastName,
        email,
        gender,
        age,
        country,
        bio,
        selectedDate,
        notification,
      ]
    );

    console.log("Form submitted successfully:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handling DELETE requests to the /api/deleteAllRows endpoint
app.delete("/api/deleteAllRows", async (req, res) => {
  const idsToDelete = req.body.ids || [];

  try {
    // Delete rows with the specified IDs from the database
    await pool.query("DELETE FROM user_data WHERE id = ANY($1::int[])", [
      idsToDelete,
    ]);

    res.json({ message: "Selected rows deleted successfully." });
  } catch (error) {
    console.error("Error deleting selected rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling DELETE requests to the /api/deleteRow/:id endpoint
app.delete("/api/deleteRow/:id", async (req, res) => {
  const userIdToDelete = parseInt(req.params.id);

  try {
    await pool.query("DELETE FROM user_data WHERE id = $1", [userIdToDelete]);
    res.json({
      message: `Row with ID ${userIdToDelete} deleted successfully.`,
    });
  } catch (error) {
    console.error(`Error deleting row with ID ${userIdToDelete}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling GET requests to the /api/searchUserData endpoint
app.get("/api/searchUserData", async (req, res) => {
  const { searchTerm, page, rowsPerPage } = req.query;

  try {
    const offset = (page - 1) * rowsPerPage;

    // Modify the query to include search conditions and pagination
    const result = await pool.query(
      "SELECT * FROM user_data WHERE LOWER(first_name) LIKE LOWER($1) OR LOWER(last_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1) ORDER BY id OFFSET $2 LIMIT $3",
      [`%${searchTerm}%`, offset, rowsPerPage]
    );

    const userData = result.rows;

    // Fetch the total count without pagination for the search term
    const totalCount = await pool.query(
      "SELECT COUNT(*) FROM user_data WHERE LOWER(first_name) LIKE LOWER($1) OR LOWER(last_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)",
      [`%${searchTerm}%`]
    );

    const totalRows = totalCount.rows[0].count;

    res.json({ userData, totalRows });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling GET requests to the /api/getAutocompleteOptions endpoint
app.get("/api/getAutocompleteOptions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT first_name FROM user_data"
    );
    const autocompleteOptions = result.rows.map((user) => user.first_name);
    res.json({ autocompleteOptions });
  } catch (error) {
    console.error("Error fetching autocomplete options:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handling GET requests to the /api/autocomplete endpoint
app.get("/api/autocomplete", async (req, res) => {
  const { searchTerm } = req.query;

  try {
    // Modify the query to include all columns in the search condition
    const autocompleteResults = await pool.query(
      "SELECT DISTINCT id, first_name, last_name, email, gender, age, country, notification, dob, bio FROM user_data WHERE LOWER(id::TEXT) LIKE LOWER($1) OR LOWER(first_name) LIKE LOWER($1) OR LOWER(last_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1) OR LOWER(gender) LIKE LOWER($1) OR LOWER(country) LIKE LOWER($1) OR LOWER(notification) LIKE LOWER($1) OR LOWER(bio) LIKE LOWER($1) LIMIT 10",
      [`%${searchTerm}%`]
    );

    // Extract the values from the database response
    const values = autocompleteResults.rows.map((result) => ({
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      gender: result.gender,
      age: result.age,
      country: result.country,
      notification: result.notification,
      dob: result.dob,
      bio: result.bio,
    }));

    res.json({ values });
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
