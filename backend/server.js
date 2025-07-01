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

async function pollTaskStatus(taskId, apiKey) {
  const maxRetries = 60; // max 60 reizes, aptuveni 3 minūtes (3s intervāls)
  const intervalMs = 3000;

  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-Runway-Version': '2024-11-06',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch task status: ${res.statusText}`);
    }

    const json = await res.json();
    if (json.status === 'SUCCEEDED') {
      return json;
    }
    if (json.status === 'FAILED' || json.status === 'CANCELED') {
      throw new Error(`Task ${json.status.toLowerCase()}`);
    }

    // gaidīt
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Task polling timed out');
}

app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const { drawingType, action, environment, duration, ratio } = req.body;

    console.log("📝 Received form data:", { drawingType, action, environment, duration, ratio });

    const validRatios = {
      "1280:720": { width: 1280, height: 720 },
      "720:1280": { width: 720, height: 1280 },
    };

    if (!validRatios[ratio]) {
      console.error("❌ Invalid ratio:", ratio);
      return res.status(400).json({ error: 'Invalid ratio selected.' });
    }

    const { width, height } = validRatios[ratio];
    const promptText = `A ${drawingType} ${action} in a ${environment}.`;
    console.log("📝 Prompt text generated:", promptText);

    if (!process.env.RUNWAY_API_KEY) {
      console.error("❌ Missing RUNWAY_API_KEY.");
      return res.status(500).json({ error: "Server misconfiguration: Missing API key." });
    }

    // Resize image with Sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0 } })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    // Call Runway API to start video generation
    const startResponse = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify({
        model: 'gen4_turbo',
        promptText,
        duration: parseInt(duration, 10),
        ratio,
        promptImage: dataUri,
        contentModeration: { publicFigureThreshold: 'auto' },
      }),
    });

    const data = await startResponse.json();

    if (!startResponse.ok) {
      console.error('❌ Runway API error response:', data);
      return res.status(500).json({ error: data.error || 'Runway API error.' });
    }

    console.log('✅ Runway video task created:', data);

    // Poll for completion
    const taskResult = await pollTaskStatus(data.id, process.env.RUNWAY_API_KEY);

    console.log('✅ Task completed:', taskResult);

    // Send back the first video URL from output array
    const videoUrl = Array.isArray(taskResult.output) ? taskResult.output[0] : null;

    res.json({ video_url: videoUrl });

  } catch (err) {
    console.error('❌ Internal server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
