const axios = require("axios");
const { API_BASE, AXIOS_TIMEOUT, NODE_TYPE_ZAW, NODE_TYPE_ZTW } = require("../config/constants");

// Lookup-Maps für O(1)-Zugriff
let idMap = new Map();
let nameMap = new Map();
let entryCount = 0;
let refreshTimer = null;

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 Stunde

function buildMaps(entries) {
  const newIdMap = new Map();
  const newNameMap = new Map();

  for (const obj of entries) {
    if (obj.signature) {
      newIdMap.set(obj.signature, obj.id);
      newNameMap.set(obj.signature, obj.attributes?.name || null);
    }
  }

  return { newIdMap, newNameMap };
}

// Lade ZAW- und ZTW-Konvolute parallel von der API
async function fetchFromAPI() {
  const [zawResponse, ztwResponse] = await Promise.all([
    axios.get(`${API_BASE}/nodes/${NODE_TYPE_ZAW}`, { timeout: AXIOS_TIMEOUT * 2 }),
    axios.get(`${API_BASE}/nodes/${NODE_TYPE_ZTW}`, { timeout: AXIOS_TIMEOUT * 2 }),
  ]);

  const zawEntries = zawResponse.data.results || zawResponse.data.result || [];
  const ztwEntries = ztwResponse.data.results || ztwResponse.data.result || [];

  return [...zawEntries, ...ztwEntries];
}

function loadFromStaticFallback() {
  const { konvolute } = require("../assets/konvolute");
  return konvolute;
}

function applyEntries(entries) {
  const { newIdMap, newNameMap } = buildMaps(entries);
  idMap = newIdMap;
  nameMap = newNameMap;
  entryCount = entries.length;
}

// Stündlicher Hintergrund-Refresh
async function refresh() {
  try {
    const entries = await fetchFromAPI();

    if (entries.length === 0) {
      console.warn("Konvolute-Refresh: API lieferte keine Einträge, behalte aktuelle Daten");
      return;
    }

    // Nur aktualisieren wenn sich die Anzahl geändert hat
    if (entries.length === entryCount) return;

    applyEntries(entries);
    console.log(`Konvolute aktualisiert: ${entryCount} Einträge`);
  } catch (error) {
    console.error("Konvolute-Refresh fehlgeschlagen:", error.message);
  }
}

// Initialisierung beim Serverstart
async function initialize() {
  try {
    const entries = await fetchFromAPI();
    applyEntries(entries);
    console.log(`Konvolute von API geladen: ${entryCount} Einträge`);
  } catch (error) {
    console.warn("API beim Start nicht erreichbar, lade statische Fallback-Datei:", error.message);
    const entries = loadFromStaticFallback();
    applyEntries(entries);
    console.log(`Konvolute aus Fallback geladen: ${entryCount} Einträge`);
  }

  // Stündliche Aktualisierung starten
  refreshTimer = setInterval(refresh, REFRESH_INTERVAL);
}

function findIdBySignature(signature) {
  return idMap.get(signature) || null;
}

function findNameBySignature(signature) {
  return nameMap.get(signature) || null;
}

function getEntryCount() {
  return entryCount;
}

module.exports = { initialize, findIdBySignature, findNameBySignature, getEntryCount };
