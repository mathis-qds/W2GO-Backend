// api/nodeRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the nodes API
const baseUrl = 'https://api.wossidia.de/nodes';

// Route to fetch categories (nodetype 40)
router.get('/40', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/40`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to fetch all nodes (nodetype 41)
router.get('/41', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/41`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get Konvolute by signature (at_zaw1)
router.get('/at_zaw1', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/at_zaw1`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
