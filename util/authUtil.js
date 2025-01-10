const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Base URL for the WossiDiA-PowerGraph API
const baseUrl = "https://api.wossidia.de";

// Function to fetch auth token
async function fetchAuthToken() {
  try {
    // Read credentials from configuration file
    const configPath = path.join(__dirname, "../config/apiConfig.json");
    const { role, pass } = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // POST request
    const response = await axios.post(`${baseUrl}/auth?role=${role}&pass=${pass}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching auth token:", error.response?.data || error.message);
    throw new Error("Failed to fetch auth token");
  }
}

module.exports = { fetchAuthToken };
