const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
const secretKey = "mySuperSecretKey123!@#";

app.use(bodyParser.json());

// In-memory data structure to store the dataset
const dataset = [];

// Dummy user for authentication
const dummyUser = { username: "Akshay", password: "Akshay@123" };

// Helper functions
function calculateSummaryStatistics(data) {
  return {
    mean: data.reduce((acc, val) => acc + val, 0) / data.length,
    min: Math.min(...data),
    max: Math.max(...data),
  };
}

function validatePayload(payload, schema) {
  return schema.every((field) => payload.hasOwnProperty(field));
}

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
}

// Middleware to check if a request has a valid token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Split the 'Bearer <token>' format to extract the actual token
  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Token:", token);
      console.log("Error:", err);
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
}

//root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Example login route that generates a token
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === dummyUser.username && password === dummyUser.password) {
    const token = generateToken(dummyUser);
    res.json({ token });
  } else {
    res.status(401).json({ error: "Authentication failed" });
  }
});

// API to add a new record
app.post("/add_record", authenticateToken, (req, res) => {
  const payload = req.body;

  if (
    !validatePayload(payload, [
      "name",
      "salary",
      "currency",
      "department",
      "sub_department",
    ])
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  dataset.push(payload);
  res.status(201).json({ message: "Record added successfully" });
});

// API to delete a record by index
app.delete("/delete_record/:recordIndex", authenticateToken, (req, res) => {
  const recordIndex = parseInt(req.params.recordIndex, 10);

  if (isNaN(recordIndex) || recordIndex < 0 || recordIndex >= dataset.length) {
    return res.status(404).json({ error: "Record not found" });
  }

  dataset.splice(recordIndex, 1);
  res.json({ message: "Record deleted successfully" });
});

// API to fetch summary statistics for salary over the entire dataset
app.get("/summary_stats/all_salary", (req, res) => {
  const salaryData = dataset.map((record) => parseFloat(record.salary));
  if (salaryData.length === 0) {
    return res.status(404).json({ error: "No data found" });
  }

  const summaryStats = calculateSummaryStatistics(salaryData);
  res.json(summaryStats);
});

// API to fetch summary statistics for salaries of records with "on_contract": "true"
app.get("/summary_stats/on_contract_salary", (req, res) => {
  // Filter the dataset to select records with "on_contract": "true"
  const onContractRecords = dataset.filter(
    (record) => record.on_contract === "true"
  );

  // Extract the salaries from the selected records
  const salaries = onContractRecords.map((record) => parseFloat(record.salary));

  if (salaries.length === 0) {
    return res.status(404).json({ error: "No on-contract records found" });
  }

  // Calculate summary statistics for salaries
  const summaryStats = calculateSummaryStatistics(salaries);

  res.json(summaryStats);
});

// API to fetch summary statistics for salaries of employees in a specific department
app.get("/summary_stats/department_salary/:department", (req, res) => {
  // Extract the 'department' from the request parameters
  const requestedDepartment = req.params.department;

  // Filter the dataset to select records in the specified department
  const departmentRecords = dataset.filter(
    (record) => record.department === requestedDepartment
  );

  // Extract the salaries from the selected records
  const salaries = departmentRecords.map((record) => parseFloat(record.salary));

  if (salaries.length === 0) {
    return res
      .status(404)
      .json({ error: "No records found for the specified department" });
  }

  // Calculate summary statistics for salaries in the specified department
  const summaryStats = calculateSummaryStatistics(salaries);

  res.json(summaryStats);
});

// API to fetch summary statistics for salaries of employees in a specific department and sub-department
app.get(
  "/summary_stats/department_sub_department_salary/:department/:sub_department",
  (req, res) => {
    // Extract the 'department' and 'sub_department' from the request parameters
    const requestedDepartment = req.params.department;
    const requestedSubDepartment = req.params.sub_department;

    // Filter the dataset to select records in the specified department and sub-department
    const subDepartmentRecords = dataset.filter(
      (record) =>
        record.department === requestedDepartment &&
        record["sub_department"] === requestedSubDepartment
    );

    // Extract the salaries from the selected records
    const salaries = subDepartmentRecords.map((record) =>
      parseFloat(record.salary)
    );

    if (salaries.length === 0) {
      return res.status(404).json({
        error:
          "No records found for the specified department and sub-department",
      });
    }

    // Calculate summary statistics for salaries in the specified department and sub-department
    const summaryStats = calculateSummaryStatistics(salaries);

    res.json(summaryStats);
  }
);

// Export the app object before starting the server
module.exports = app;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
