const axios = require("axios");
const { fetchAuthToken } = require("./authUtil"); // Adjust path as necessary

const baseUrl = "https://api.wossidia.de/update";

async function createNode(nodeType, nodeAttributes) {
  const baseUrl = "https://api.wossidia.de/update/nodeCreate";

  const authToken = await fetchAuthToken();
  // Construct the JSON structure as required by the API
  const nodeData = {
    type: nodeType,
    attrs: nodeAttributes,
  };    

  const response = await axios.post(baseUrl, null, {
    params: {
      auth: authToken, 
      format: "json", 
      json: JSON.stringify(nodeData),
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

module.exports = { createNode };
