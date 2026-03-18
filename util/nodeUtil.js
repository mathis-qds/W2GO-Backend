const axios = require("axios");
const { fetchAuthToken } = require("./authUtil");
const { API_BASE, AXIOS_TIMEOUT } = require("../config/constants");

async function createNode(nodeType, nodeAttributes) {
  try {
    const authToken = await fetchAuthToken();

    const nodeData = {
      type: nodeType,
      attrs: nodeAttributes,
    };

    const response = await axios.post(`${API_BASE}/update/nodeCreate`, null, {
      params: {
        auth: authToken,
        format: "json",
        json: JSON.stringify(nodeData),
      },
      headers: { "Content-Type": "application/json" },
      timeout: AXIOS_TIMEOUT,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Node konnte nicht erstellt werden: ${error.message}`);
  }
}

module.exports = { createNode };
