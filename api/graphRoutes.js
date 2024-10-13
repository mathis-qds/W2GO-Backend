const express = require('express');
const axios = require('axios');
const router = express.Router();

const { konvolute, findIdBySignature } = require('../assets/konvolute');


// Route to get konvolut by signature (down to page level)
router.get('/:signature', async (req, res) => {
    const { signature } = req.params;
    const konvolutId = findIdBySignature(konvolute, signature)
    try {
        const response = await axios.get(`https://api.wossidia.de/graph/${konvolutId}/<0:102:1>103<0:103:1>104`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to handle ImageDigital attribute and convert decimal to hex
router.get('/image/:imageId/:type', (req, res) => {
    const { imageId, type } = req.params;
    const hexString = parseInt(imageId).toString(16);

    const validTypes = ['working', 'master', 'thumb'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Use working, master, or thumb.' });
    }

    const imageUrl = `https://digipool.wossidia.de/${hexString}/${type}`;
    res.json({ imageUrl });
});

module.exports = router;
