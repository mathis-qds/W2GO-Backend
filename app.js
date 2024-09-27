// app.js
const express = require('express');
const catalogRoutes = require('./api/catalogRoutes');
const nodeRoutes = require('./api/nodeRoutes');
const graphRoutes = require('./api/graphRoutes');

const app = express();
const port = 3000;

// Use routes
app.use('/catalog', catalogRoutes);
app.use('/nodes', nodeRoutes);
app.use('/graph', graphRoutes);

// Error handling
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
