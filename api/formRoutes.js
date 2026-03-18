const express = require("express");
const { NODE_TYPE_CONTRIBUTION } = require("../config/constants");
const { createNode } = require("../util/nodeUtil");
const router = express.Router();

// POST /form/submit — Beitrag einreichen
router.post("/submit", async (req, res) => {
  try {
    const { type, data, transcriber, email, source, language } = req.body;

    if (!type || !data || !source || !language) {
      return res.status(400).json({ error: "Pflichtfelder fehlen: type, data, source, language" });
    }

    const formData = {
      time: new Date().toISOString(),
      type,
      data,
      transcriber: transcriber || "",
      email: email || "",
      source,
      language,
    };

    const nodeResponse = await createNode(NODE_TYPE_CONTRIBUTION, formData);
    res.status(201).json({ message: "Beitrag erfolgreich erstellt", data: nodeResponse });
  } catch (error) {
    console.error("Fehler beim Erstellen des Beitrags:", error.message);
    res.status(502).json({ error: `Fehler beim Erstellen: ${error.message}` });
  }
});

module.exports = router;
