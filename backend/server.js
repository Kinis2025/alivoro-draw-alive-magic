import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sharp from 'sharp';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

/**
 * Poll Runway task status until completion
 */
async function pollTaskStatus(taskId, apiKey) {
  const maxRetries = 60;
  const intervalMs = 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'X-Runway-Version': '2024-11-06',
        },
      });

      if (!res.ok) {
        console.error(`⏳ Polling attempt ${i + 1}: status ${res.status}`);
        throw new Error(`Failed to fetch task status: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.status === 'SUCCEEDED') return json;
      if (json.status === 'FAILED' || json.status === 'CANCELED') {
        throw new Error(`Task ${json.status.toLowerCase()}`);
      }

    } catch (err) {
      console.warn(`⚠️ Polling error (attempt ${i + 1}):`, err.message);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error('Task polling timed out');
}

/**
 * Endpoint: Generate video (Runway)
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { imageUrl, action, environment } = req.body;

    const duration = 5;
    const ratio = "720:1280";
    const { width, height } = { width: 720, height: 1280 };

    console.log("📝 Received form data:", { action, environment });

    const promptText = `A realistic version of the subject in the input drawing, preserving its unique shape and form. Transform the subject into a 3D object. The subject ${action} in the ${environment}. Cinematic, photorealistic, vibrant lighting, smooth animation.`;
    console.log("📝 Prompt text generated:", promptText);

    if (!process.env.RUNWAY_API_KEY) {
      console.error("❌ Missing RUNWAY_API_KEY.");
      return res.status(500).json({ error: "Server misconfiguration: Missing API key." });
    }

    // 🔽 Download image from Firebase URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from URL: ${imageUrl}`);
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    // 🔧 Resize image
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0 } })
      .toFormat('jpeg')
      .toBuffer();

    const base64Image = resizedImageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    // 🚀 Create Runway task
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
        duration,
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

    await new Promise((r) => setTimeout(r, 2000));
    const taskResult = await pollTaskStatus(data.id, process.env.RUNWAY_API_KEY);

    console.log('✅ Task completed:', taskResult);

    const videoUrl = Array.isArray(taskResult.output) ? taskResult.output[0] : null;
    res.json({ video_url: videoUrl });

  } catch (err) {
    console.error('❌ Internal server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

/**
 * Endpoint: Stripe checkout session
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Video Generation',
              description: 'Generate an AI video from your drawing',
            },
            unit_amount: 200, // €2.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: 'https://profound-pastelito-9a87a9.netlify.app/success',
      cancel_url: 'https://profound-pastelito-9a87a9.netlify.app/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
