const express = require("express");
const axios = require("axios");
const router = express.Router();

const { konvolute, findIdBySignature } = require("../assets/konvolute");

// Base URL for the graph API
const baseUrl = "https://api.wossidia.de/graph";

// Route to get konvolut by signature (down to page level)
router.get("/:signature", async (req, res) => {
  const { signature } = req.params;
  const konvolutId = findIdBySignature(konvolute, signature);
  console.log(konvolutId);
  try {
    // Determine the URL path based on the signature
    const urlPath = signature.startsWith("ZTW")
      ? `<0:141:1>142<0:142:1>143`
      : `<0:102:1>103<0:103:1>104`;

    const response = await axios.get(`${baseUrl}/${konvolutId}/${urlPath}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to handle ImageDigital attribute and convert decimal to hex
router.get("/image/:imageId/:type", (req, res) => {
  const { imageId, type } = req.params;
  const hexString = parseInt(imageId).toString(16);

  const validTypes = ["working", "master", "thumb"];
  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ error: "Invalid type. Use working, master, or thumb." });
  }

  const imageUrl = `https://digipool.wossidia.de/${hexString}/${type}`;
  res.json({ imageUrl });
});

router.get("/transcript/:signature", async (req, res) => {
  const { signature } = req.params;
  const konvolutId = findIdBySignature(konvolute, signature);
  try {
    // Determine the URL path based on the signature
    const urlPath = signature.startsWith("ZTW")
      ? `%3C0:141:1%3E142%3Ctranscr_wossidia%3Eam_transcription`
      : `%3C0:102:1%3E103%3Ctranscr_wossidia%3Eam_transcription`;

    const response = await axios.get(`${baseUrl}/${konvolutId}/${urlPath}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
