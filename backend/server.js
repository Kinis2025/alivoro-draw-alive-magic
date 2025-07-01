import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sharp from 'sharp';

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const { drawingType, action, environment, duration, ratio } = req.body;

    // ✅ Only accept portrait and landscape
    const validRatios = {
      "landscape": { width: 1280, height: 720, runwayRatio: "1280:720" },
      "portrait": { width: 720, height: 1280, runwayRatio: "720:1280" },
    };

    if (!validRatios[ratio]) {
      return res.status(400).json({ error: 'Invalid ratio selected.' });
    }

    const { width, height, runwayRatio } = validRatios[ratio];

    // ✅ Build prompt text dynamically
    const promptText = `A ${drawingType} ${action} in a ${environment}.`;

    // ✅ Check if API Key exists
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing RUNWAY_API_KEY in environment variables.");
      return res.status(500).json({ error: "Server misconfiguration. Please contact support." });
    }

    // ✅ Prepare image (resize with background)
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({
        width,
        height,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0 },
      })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    // ✅ Runway API request
    const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify({
        model: 'gen4_turbo',
        promptText,
        duration: parseInt(duration),
        ratio: runwayRatio,
        promptImage: dataUri,
        contentModeration: {
          publicFigureThreshold: 'auto',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Runway API error:', data);
      return res.status(500).json({ error: data.error || 'Runway API error.' });
    }

    console.log('✅ Video generation initiated:', data);

    res.json({ video_url: `https://api.dev.runwayml.com/v1/tasks/${data.id}` });

  } catch (err) {
    console.error('❌ Internal server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
