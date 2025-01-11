// api/nodeRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { konvolute, findNameBySignature } = require("../assets/konvolute");


// Base URL for the nodes API
const baseUrl = "https://api.wossidia.de/nodes";

// Route to fetch categories (nodetype 40)
router.get("/40", async (req, res) => {
  try {
    const { zaw, ztw } = req.query; // Extract query parameters
    const response = await axios.get(`${baseUrl}/40`);
    const nodes = response.data.result;

    const processedNodes = nodes.map((item) => {
      // Check if attributes.pool exists and is a string
      const poolString = item.attributes?.pool;
    
      if (!poolString || typeof poolString !== 'string') {
        console.warn(`Invalid pool string for item with id ${item.id}`);
        return {
          ...item,
          attributes: {
            ...item.attributes,
            pool: [], // Default to an empty array if pool is invalid
          },
        };
      }
    
      // Split the pool into individual IDs, trim whitespace, and flatten into one array
      const poolIds = poolString
        .split(/[\n,]+/) // Split on commas and newlines
        .map((id) => id.trim()) // Trim whitespace
        .filter((id) => id); // Remove empty entries
    
      // Use findNameBySignature to get the name for each poolId
      const pool = poolIds.map((id) => ({
        signature: id,
        name: findNameBySignature(konvolute, id) || null, // Fallback to null if no name is found
      }));
    
      // Return the updated object with transformed pool
      return {
        ...item,
        attributes: {
          ...item.attributes,
          pool, // Replace pool with the array of objects
        },
      };
    });

    // Filter processed nodes based on query parameters
    const filteredNodes = processedNodes.filter((node) => {
      if (zaw) {
        // Filter for pool entries starting with "ZAW"
        node.attributes.pool = node.attributes.pool.filter((entry) =>
          entry.signature.startsWith("ZAW")
        );
        return node.attributes.pool.length > 0; // Only include nodes with matching pool entries
      }
      if (ztw) {
        // Filter for pool entries starting with "ZTW"
        node.attributes.pool = node.attributes.pool.filter((entry) =>
          entry.signature.startsWith("ZTW")
        );
        return node.attributes.pool.length > 0; // Only include nodes with matching pool entries
      }
      return true; // If no query parameters, include all nodes
    });

    res.json(filteredNodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to fetch all nodes (nodetype 41)
router.get("/41", async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/41`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get Konvolute by signature (at_zaw1)
router.get("/at_zaw1", async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/at_zaw1`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
