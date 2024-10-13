const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const upload = multer();

router.post('/submit', upload.single('audio'), (req, res) => {
  try {
    const { name, transcription, language } = req.body; 
    const audio = req.file; 

    const formData = {
      name,
      transcription,
      language,
      timestamp: new Date().toISOString(),
    };

    if (audio) {
      const audioBase64 = audio.buffer.toString('base64'); 
      formData.audio = audioBase64; 
    }

    const jsonFileName = `${uuidv4()}.json`;
    const jsonFilePath = path.join(__dirname, '../files', jsonFileName);
    fs.writeFileSync(jsonFilePath, JSON.stringify(formData, null, 2), 'utf-8');

    res.status(200).json({ message: 'Data submitted successfully', jsonFilePath });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data' });
  }
});

module.exports = router;
