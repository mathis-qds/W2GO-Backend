const express = require("express");
const axios = require("axios");
const { API_BASE, AXIOS_TIMEOUT, NODE_TYPE_CATEGORY, NODE_TYPE_CONTRIBUTION } = require("../config/constants");
const router = express.Router();

const ALLOWED_NODE_TYPES = [String(NODE_TYPE_CATEGORY), String(NODE_TYPE_CONTRIBUTION)];

// GET /catalog/nodetype/:id — Nodetyp-Definition abrufen
router.get("/nodetype/:id", async (req, res) => {
  const { id } = req.params;
  if (!ALLOWED_NODE_TYPES.includes(id)) {
    return res.status(400).json({ error: `Ungültige Nodetyp-ID. Erlaubt: ${ALLOWED_NODE_TYPES.join(", ")}` });
  }
  try {
    const response = await axios.get(`${API_BASE}/catalog/nodetype/${id}`, { timeout: AXIOS_TIMEOUT });
    res.json(response.data.results || response.data.result);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

module.exports = router;
