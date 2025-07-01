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
  const url = `https://api.dev.runwayml.com/v1/tasks/${taskId}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'X-Runway-Version': '2024-11-06',
  };

  while (true) {
    console.log(`🔄 Polling task status for ${taskId}...`);

    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error fetching task status:', data);
      throw new Error(data.error || 'Failed to get task status');
    }

    console.log(`🕒 Task status: ${data.status}`);

    if (data.status === 'COMPLETED') {
      console.log('✅ Task completed:', data);
      return data;
    } else if (data.status === 'FAILED') {
      console.error('❌ Video generation failed');
      throw new Error('Video generation failed');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    const { drawingType, action, environment, duration, ratio } = req.body;

    console.log("📝 Received form data:", { drawingType, action, environment, duration, ratio });

    const validRatios = {
      "1280:720": { width: 1280, height: 720, runwayRatio: "1280:720" },
      "720:1280": { width: 720, height: 1280, runwayRatio: "720:1280" },
    };

    if (!validRatios[ratio]) {
      console.error("❌ Invalid ratio:", ratio);
      return res.status(400).json({ error: 'Invalid ratio selected.' });
    }

    const { width, height, runwayRatio } = validRatios[ratio];
    const promptText = `A ${drawingType} ${action} in a ${environment}.`;
    console.log("📝 Prompt text generated:", promptText);

    if (!process.env.RUNWAY_API_KEY) {
      console.error("❌ Missing RUNWAY_API_KEY.");
      return res.status(500).json({ error: "Server misconfiguration: Missing API key." });
    }

    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0 } })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify({
        model: 'gen4_turbo',
        promptText,
        duration: parseInt(duration),
        ratio: runwayRatio,
        promptImage: dataUri,
        contentModeration: { publicFigureThreshold: 'auto' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Runway API error response:', data);
      return res.status(500).json({ error: data.error || 'Runway API error.' });
    }

    console.log('✅ Runway video task created:', data);

    const taskResult = await pollTaskStatus(data.id, process.env.RUNWAY_API_KEY);

    res.json({ video_url: taskResult.output?.videoUri || taskResult.output?.videoUrl || null });

  } catch (err) {
    console.error('❌ Internal server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
