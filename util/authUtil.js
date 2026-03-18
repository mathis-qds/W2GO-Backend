const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { API_BASE, AXIOS_TIMEOUT } = require("../config/constants");

// Konfiguration einmalig beim Start laden
const configPath = path.join(__dirname, "../config/apiConfig.json");
let credentials = null;

function loadCredentials() {
  if (!credentials) {
    credentials = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  return credentials;
}

// Token-Cache mit TTL (30 Minuten)
let cachedToken = null;
let tokenExpiry = 0;
const TOKEN_TTL = 30 * 60 * 1000;

async function fetchAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const { role, pass } = loadCredentials();
    const response = await axios.post(
      `${API_BASE}/auth?role=${role}&pass=${pass}`,
      null,
      { timeout: AXIOS_TIMEOUT }
    );

    cachedToken = response.data.result;
    tokenExpiry = now + TOKEN_TTL;
    return cachedToken;
  } catch (error) {
    throw new Error(`Auth-Token konnte nicht abgerufen werden: ${error.message}`);
  }
}

module.exports = { fetchAuthToken };
