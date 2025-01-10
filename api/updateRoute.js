const express = require("express");
const axios = require("axios");
const { fetchAuthToken } = require("../util/authUtil"); // Token fetch function
const router = express.Router();

// Base URL for the WossiDiA API
const baseUrl = "https://api.wossidia.de/update";

// POST route to create a node
router.post("/nodeCreate", async (req, res) => {
  try {
    const token = await fetchAuthToken(); // Fetch the auth token
    
    // Receive data from the frontend (e.g., req.body)
    const { type, attributes } = req.body;

    if (!type || !attributes) {
      return res.status(400).json({ error: "Missing 'type' or 'attributes' in request body" });
    }

    // Make the API call to WossiDiA
    const response = await axios.post(
      `${baseUrl}/nodeCreate`,
      null, // No request body (params in query)
      {
        params: {
          auth: token,
          format: "json",
          type, // Type of the node (e.g., 41)
          attributes: JSON.stringify(attributes) // Pass attributes as JSON string
        }
      }
    );

    // Respond to the frontend with the API result
    res.status(201).json({
      message: "Node created successfully",
      data: response.data
    });
  } catch (error) {
    console.error("Error creating node:", error.message);
    res.status(500).json({
      error: error.response?.data || "Failed to create node"
    });
  }
});

module.exports = router;
