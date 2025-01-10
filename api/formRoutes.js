const express = require('express');
const multer = require('multer');
//const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const upload = multer();
const { createNode } = require('../util/nodeUtil');

router.post('/submit', upload.single('audio'), async (req, res) => {
  try {
    const { type, data, transcriber, source, language } = req.body; 
    const audio = req.file; 

    const formData = {
      time: new Date().toISOString(),
      type,
      data,
      transcriber,
      source,
      language
    };

    if (audio) {
      const audioBase64 = audio.buffer.toString('base64'); 
      formData.audio = audioBase64; 
    }

    const nodeType = 41;
    const nodeResponse = await createNode(nodeType, formData);

    res.status(201).json({ message: 'Node created successfully', data: nodeResponse });
  } catch (error) {
    console.error('Error during submission or node creation:', error);
    res.status(500).json({ message: 'Error during submission or node creation', details: error.message });
  }
});


module.exports = router;
