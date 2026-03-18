// Zentrale Konfiguration

// Server
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const AXIOS_TIMEOUT = 15000;

// Externe Dienste
const API_BASE = process.env.WOSSIDIA_API_BASE || "https://api.wossidia.de";
const DIGIPOOL_BASE = process.env.DIGIPOOL_BASE || "https://digipool.wossidia.de";

// WossiDiA Nodetypen
const NODE_TYPE_CATEGORY = 40;       // Kategorien (Konvolut-Gruppen)
const NODE_TYPE_CONTRIBUTION = 41;   // Beiträge (Transkriptionen, Übersetzungen)
const NODE_TYPE_ZAW = 102;           // Handschriftliche Originalzettel
const NODE_TYPE_ZTW = 141;           // Maschinell transkribierte Karten

// Graph-Traversierungspfade (WossiDiA PowerGraph API)
const GRAPH_PATHS = {
  ZAW_CONTENT:    "<0:102:1>103<0:103:1>104",
  ZTW_CONTENT:    "<0:141:1>142<0:142:1>143",
  ZAW_TRANSCRIPT: "%3C0:102:1%3E103%3Ctranscr_wossidia%3Eam_transcription",
  ZTW_TRANSCRIPT: "%3C0:141:1%3E142%3Ctranscr_wossidia%3Eam_transcription",
};

// Erlaubte Bild-Typen (Digipool)
const VALID_IMAGE_TYPES = ["working", "master", "thumb"];

module.exports = {
  PORT, CORS_ORIGIN, AXIOS_TIMEOUT,
  API_BASE, DIGIPOOL_BASE,
  NODE_TYPE_CATEGORY, NODE_TYPE_CONTRIBUTION, NODE_TYPE_ZAW, NODE_TYPE_ZTW,
  GRAPH_PATHS, VALID_IMAGE_TYPES,
};
