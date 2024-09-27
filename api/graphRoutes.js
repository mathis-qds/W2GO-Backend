// api/graphRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get Konvolut by ID (down to page level)
router.get('/:konvolutId', async (req, res) => {
    const { konvolutId } = req.params;
    try {
        const response = await axios.get(`https://api.wossidia.de/graph/${konvolutId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to handle ImageDigital attribute and convert decimal to hex
router.get('/image/:hexValue/:type', (req, res) => {
    const { hexValue, type } = req.params;
    const hexString = parseInt(hexValue, 10).toString(16).toUpperCase();

    const validTypes = ['working', 'master', 'thumb'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Use working, master, or thumb.' });
    }

    const imageUrl = `https://digipool.wossidia.de/${hexString}/${type}`;
    res.json({ imageUrl });
});

module.exports = router;
