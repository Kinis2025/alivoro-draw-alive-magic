import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Play, LoaderCircle, Download } from 'lucide-react';

import { storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [action, setAction] = useState('');
  const [environment, setEnvironment] = useState('');
  const [ratio, setRatio] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setVideoUrl(null);

    if (!selectedFile || !action || !environment || !ratio || !duration) {
      setError('Please fill in all fields before generating!');
      return;
    }

    try {
      setLoading(true);

      const uniqueFileName = `${uuidv4()}_${selectedFile.name}`;
      const storageRef = ref(storage, `uploads/${uniqueFileName}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Uploaded to Firebase Storage. Download URL:", downloadURL);

      const payload = {
        imageUrl: downloadURL,
        action,
        environment,
        ratio,
        duration,
      };

      const response = await fetch("https://alivoro-server.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Video generation result:", data);

      if (data.video_url) {
        setVideoUrl(data.video_url);
      } else {
        setError("Video generation succeeded but no video URL was returned.");
      }

    } catch (error) {
      console.error("Error generating video:", error);
      setError("Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">📸</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upload Your Drawing and Generate Video
          </h2>
          <p className="text-xl text-gray-600">
            Transform your child's creativity into magical moving stories
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">Create Your Magic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* File upload */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                🔹 Upload Drawing:
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors inline-block font-semibold"
                >
                  Choose File
                </label>
                {selectedFile && (
                  <p className="mt-2 text-green-600 font-medium">
                    ✅ {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Select fields */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900">🔹 Choose What It Does:</label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moves">Moves</SelectItem>
                  <SelectItem value="runs">Runs</SelectItem>
                  <SelectItem value="flies">Flies</SelectItem>
                  <SelectItem value="drives">Drives</SelectItem>
                  <SelectItem value="jumps">Jumps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900">🔹 Choose Environment:</label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select environment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="city street">City street</SelectItem>
                  <SelectItem value="racetrack">Racetrack</SelectItem>
                  <SelectItem value="sky">Sky</SelectItem>
                  <SelectItem value="magical world">Magical world</SelectItem>
                  <SelectItem value="desert">Desert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900">🔹 Choose Video Aspect Ratio:</label>
              <Select value={ratio} onValueChange={setRatio}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select aspect ratio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720:1280">Portrait (9:16)</SelectItem>
                  <SelectItem value="1280:720">Landscape (16:9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900">🔹 Choose Video Duration:</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select duration..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate button */}
<Button
  onClick={handleGenerate}
  disabled={loading}
  className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
>
  {loading ? (
    <span className="text-sm text-white text-center">
      <LoaderCircle className="w-5 h-5 inline animate-spin mr-2" />
      Generating... Do not close this window!
    </span>
  ) : (
    <>
      <Play className="w-6 h-6 mr-2" />
      Generate Video
    </>
  )}
</Button>




            {/* Result */}
            {videoUrl && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center border-2 border-dashed border-gray-300">
                <video controls src={videoUrl} className="mx-auto rounded-lg mb-4" />
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = videoUrl!;
                    link.download = "my-generated-video.mp4";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Open & Download Video
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;
