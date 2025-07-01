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
    const { action, environment, duration, ratio } = req.body;

    console.log("📝 Received form data:", { action, environment, duration, ratio });

    const validRatios = {
      "landscape": { width: 1280, height: 720, runwayRatio: "1280:720" },
      "portrait": { width: 720, height: 1280, runwayRatio: "720:1280" },
    };

    if (!validRatios[ratio]) {
      console.error("❌ Invalid ratio:", ratio);
      return res.status(400).json({ error: 'Invalid ratio selected.' });
    }

    const { width, height, runwayRatio } = validRatios[ratio];

    if (!process.env.RUNWAY_API_KEY) {
      console.error("❌ Missing RUNWAY_API_KEY.");
      return res.status(500).json({ error: "Server misconfiguration: Missing API key." });
    }

    // ✅ **Universal prompt**
    const promptText = `A realistic version of the subject in the input drawing, preserving its unique shape and form. The subject ${action} in the ${environment}. Cinematic, photorealistic, vibrant lighting, smooth animation.`;
    console.log("📝 Prompt text generated:", promptText);

    // Resize image with Sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0 } })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    // Call Runway API
    const response = await fetch('https://api.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify({
        model: 'gen4_turbo',
        prompt: promptText,
        duration: parseInt(duration),
        ratio: runwayRatio,
        input_image: dataUri,
        contentModeration: { publicFigureThreshold: 'auto' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Runway API error response:', data);
      return res.status(500).json({ error: data.error || 'Runway API error.' });
    }

    console.log('✅ Runway video task created:', data);
    res.json({ video_url: `https://api.runwayml.com/v1/tasks/${data.id}` });

  } catch (err) {
    console.error('❌ Internal server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
