// api/catalogRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the catalog API
const baseUrl = 'https://api.wossidia.de/catalog';

// Route to get nodetype 40
router.get('/nodetype/40', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/nodetype/40`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get nodetype 41
router.get('/nodetype/41', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}/nodetype/41`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
