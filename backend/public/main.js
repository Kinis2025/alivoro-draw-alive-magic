document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const imageInput = document.getElementById("imageInput");
  const promptInput = document.getElementById("prompt");
  const durationInput = document.getElementById("duration");
  const ratioSelect = document.getElementById("ratio");
  const resultDiv = document.getElementById("result");

  async function pollForVideoUrl(taskId) {
  const maxRetries = 40;
  let attempts = 0;

  while (attempts < maxRetries) {
    console.log(`Polling attempt ${attempts + 1}...`);

    const response = await fetch(`https://alivoro-server.onrender.com/api/task/${taskId}`);
    const data = await response.json();
    console.log("Runway API response:", data);

    if (data.status === 'SUCCEEDED') {
      console.log("✅ Full output data:", data.output);

      resultDiv.textContent = JSON.stringify(data.output, null, 2);

      // ✅ Ja output ir masīvs ar tiešu URL string
      if (Array.isArray(data.output) && data.output.length > 0) {
        const videoUrl = data.output[0];
        console.log("🎬 Video URL found (direct string):", videoUrl);
        return videoUrl;
      }

      throw new Error("Video generation succeeded, but no usable video URL found in output.");
    }

    if (data.status === 'FAILED') {
      throw new Error(`Video generation failed. Reason: ${data.error || 'unknown'}`);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Video generation timed out.');
}

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!imageInput.files.length || !promptInput.value.trim()) {
      alert('Please provide both a drawing and a prompt.');
      return;
    }

    resultDiv.textContent = '⬆️ Uploading drawing and prompt...';

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('prompt', promptInput.value.trim());
    formData.append('duration', durationInput.value || '5');
    formData.append('ratio', ratioSelect.value);

    try {
      const response = await fetch('https://alivoro-server.onrender.com/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Initial generate response:', data);

      if (response.ok && data.video_url) {
        const taskId = data.video_url.split('/').pop();

        resultDiv.textContent = "✅ Request submitted. Waiting for video generation...";

        const videoUrl = await pollForVideoUrl(taskId);

        resultDiv.innerHTML = `
          ✅ Video ready:<br>
          <video controls autoplay loop width="320">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <br>
          <a href="${videoUrl}" target="_blank">Download Video</a>
        `;
      } else {
        resultDiv.textContent = "❌ Error: " + (data.error || "Invalid response. Raw data: " + JSON.stringify(data));
      }

    } catch (err) {
      console.error('Error:', err);
      resultDiv.textContent = '❌ Error: ' + err.message;
    }
  });
});
