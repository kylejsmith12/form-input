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
    const result = await pool.query("SELECT * FROM user_data");
    const userData = result.rows;

    console.log(userData); // Log the data to inspect its structure
    res.json(userData);
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

// Handling GET requests to the /api/submitForm endpoint
app.get("/api/submitForm", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
