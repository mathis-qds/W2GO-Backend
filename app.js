const express = require("express");
const cors = require("cors");
const { CORS_ORIGIN, PORT } = require("./config/constants");
const { initialize: initKonvolute } = require("./util/konvoluteLoader");

const catalogRoutes = require("./api/catalogRoutes");
const nodeRoutes = require("./api/nodeRoutes");
const graphRoutes = require("./api/graphRoutes");
const formRoutes = require("./api/formRoutes");

const app = express();

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, optionsSuccessStatus: 200 }));

// Routen
app.use("/catalog", catalogRoutes);
app.use("/nodes", nodeRoutes);
app.use("/graph", graphRoutes);
app.use("/form", formRoutes);

// Globaler Fehler-Handler
app.use((err, req, res, next) => {
  console.error("Unbehandelter Fehler:", err.message);
  res.status(500).json({ error: "Interner Serverfehler" });
});

// Konvolute laden, dann Server starten
initKonvolute().then(() => {
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
});
