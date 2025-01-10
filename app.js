// app.js
const express = require("express");
const cors = require("cors");

const catalogRoutes = require("./api/catalogRoutes");
const nodeRoutes = require("./api/nodeRoutes");
const graphRoutes = require("./api/graphRoutes");
const formRoutes = require("./api/formRoutes");

const app = express();
const port = 3000;
// Enable CORS for all routes
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests only from this origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on status 204
};

app.use(cors(corsOptions));

// Use routes
app.use("/catalog", catalogRoutes);
app.use("/nodes", nodeRoutes);
app.use("/graph", graphRoutes);
app.use("/form", formRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
