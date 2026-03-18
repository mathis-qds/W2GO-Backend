const express = require("express");
const axios = require("axios");
const { API_BASE, DIGIPOOL_BASE, AXIOS_TIMEOUT, GRAPH_PATHS, VALID_IMAGE_TYPES } = require("../config/constants");
const { findIdBySignature } = require("../util/konvoluteLoader");
const router = express.Router();

// Signatur-Format validieren (z.B. ZAW-B207-001)
const SIGNATURE_PATTERN = /^[A-Z]{3}-[A-Z0-9]+-\d{3}$/;

// Gemeinsame Logik: Signatur auflösen und Graph-Daten abrufen
async function fetchGraphData(signature, ztwPath, zawPath) {
  const konvolutId = findIdBySignature(signature);
  if (!konvolutId) return null;

  const graphPath = signature.startsWith("ZTW") ? ztwPath : zawPath;
  const response = await axios.get(`${API_BASE}/graph/${konvolutId}/${graphPath}`, { timeout: AXIOS_TIMEOUT });
  return response.data;
}

// GET /graph/:signature — Konvolut-Inhalt nach Signatur
router.get("/:signature", async (req, res) => {
  const signature = req.params.signature.trim();
  if (!SIGNATURE_PATTERN.test(signature)) {
    return res.status(400).json({ error: "Ungültiges Signatur-Format" });
  }
  try {
    const data = await fetchGraphData(signature, GRAPH_PATHS.ZTW_CONTENT, GRAPH_PATHS.ZAW_CONTENT);
    if (!data) return res.status(404).json({ error: `Signatur "${signature}" nicht gefunden` });
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

// GET /graph/image/:imageId/:type — Bild-URL generieren (Dezimal → Hex)
router.get("/image/:imageId/:type", (req, res) => {
  const { imageId, type } = req.params;
  const parsedId = parseInt(imageId, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Ungültige Bild-ID. Muss eine Zahl sein." });
  }
  if (!VALID_IMAGE_TYPES.includes(type)) {
    return res.status(400).json({ error: `Ungültiger Typ. Erlaubt: ${VALID_IMAGE_TYPES.join(", ")}` });
  }

  const hexId = parsedId.toString(16);
  res.json({ imageUrl: `${DIGIPOOL_BASE}/${hexId}/${type}` });
});

// GET /graph/transcript/:signature — Transkriptionen nach Signatur
router.get("/transcript/:signature", async (req, res) => {
  const signature = req.params.signature.trim();
  if (!SIGNATURE_PATTERN.test(signature)) {
    return res.status(400).json({ error: "Ungültiges Signatur-Format" });
  }
  try {
    const data = await fetchGraphData(signature, GRAPH_PATHS.ZTW_TRANSCRIPT, GRAPH_PATHS.ZAW_TRANSCRIPT);
    if (!data) return res.status(404).json({ error: `Signatur "${signature}" nicht gefunden` });
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: `Upstream-Fehler: ${error.message}` });
  }
});

module.exports = router;
