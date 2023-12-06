const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

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
    const { page, rowsPerPage } = req.query;
    const offset = (page - 1) * rowsPerPage; // Calculate the offset

    // Fetch the total count of rows
    const totalCount = await pool.query("SELECT COUNT(*) FROM user_data");
    const totalRows = totalCount.rows[0].count;

    // Fetch the subset of rows based on pagination
    const result = await pool.query(
      "SELECT * FROM user_data ORDER BY id OFFSET $1 LIMIT $2",
      [offset, rowsPerPage]
    );
    const userData = result.rows;

    console.log(userData); // Log the data to inspect its structure
    res.json({ userData, totalRows });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

// Endpoint to delete all rows
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

// Endpoint to delete a specific row based on ID
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
