const express = require("express");
const axios = require("axios");
const { API_BASE, AXIOS_TIMEOUT, NODE_TYPE_CATEGORY, NODE_TYPE_CONTRIBUTION } = require("../config/constants");
const { findNameBySignature } = require("../util/konvoluteLoader");
const router = express.Router();

// In-Memory-Cache für verarbeitete Kategorien (TTL: 5 Minuten)
let nodesCache = null;
let nodesCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

// Pool-String (komma-/zeilengetrennte Signaturen) in strukturiertes Array umwandeln
function parsePool(poolString) {
  if (!poolString || typeof poolString !== "string") return [];

  return poolString
    .split(/[\n,]+/)
    .map((id) => id.trim())
    .filter((id) => id)
    .map((signature) => ({
      signature,
      name: findNameBySignature(signature) || null,
    }));
}

// Kategorien von der API laden, Pool-Attribute verarbeiten und cachen
async function fetchAndProcessNodes() {
  const now = Date.now();
  if (nodesCache && now - nodesCacheTime < CACHE_TTL) {
    return nodesCache;
  }

  const response = await axios.get(`${API_BASE}/nodes/${NODE_TYPE_CATEGORY}`, { timeout: AXIOS_TIMEOUT });
  const nodes = response.data.results || response.data.result;

  if (!Array.isArray(nodes)) {
    throw new Error("Unerwartetes Antwortformat der Upstream-API");
  }

  nodesCache = nodes.map((item) => ({
    ...item,
    attributes: { ...item.attributes, pool: parsePool(item.attributes?.pool) },
  }));

  nodesCacheTime = now;
  return nodesCache;
}

// GET /nodes/40 — Kategorien mit optionalem ZAW/ZTW-Filter
router.get(`/${NODE_TYPE_CATEGORY}`, async (req, res) => {
  try {
    const { zaw, ztw } = req.query;
    const allNodes = await fetchAndProcessNodes();

    if (!zaw && !ztw) return res.json(allNodes);

    // Kopie filtern, um Cache nicht zu mutieren
    const prefix = zaw ? "ZAW" : "ZTW";
    const filteredNodes = allNodes
      .map((node) => {
        const filteredPool = node.attributes.pool.filter((entry) =>
          entry.signature.startsWith(prefix)
        );
        if (filteredPool.length === 0) return null;
        return { ...node, attributes: { ...node.attributes, pool: filteredPool } };
      })
      .filter(Boolean);

    res.json(filteredNodes);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

// GET /nodes/41 — Alle Beitrags-Nodes
router.get(`/${NODE_TYPE_CONTRIBUTION}`, async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/nodes/${NODE_TYPE_CONTRIBUTION}`, { timeout: AXIOS_TIMEOUT });
    res.json(response.data);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

// GET /nodes/at_zaw1 — Konvolute (Proxy)
router.get("/at_zaw1", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/nodes/at_zaw1`, { timeout: AXIOS_TIMEOUT });
    res.json(response.data);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

module.exports = router;
