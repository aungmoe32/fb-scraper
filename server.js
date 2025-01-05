const express = require("express");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Additional route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
