import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Play, LoaderCircle, Download } from 'lucide-react';

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [drawingType, setDrawingType] = useState('');
  const [action, setAction] = useState('');
  const [environment, setEnvironment] = useState('');
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

    if (!selectedFile || !drawingType || !action || !environment) {
      setError('Please fill in all fields before generating!');
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("drawingType", drawingType);
    formData.append("action", action);
    formData.append("environment", environment);

    try {
      setLoading(true);

      const response = await fetch("https://alivoro-server.onrender.com/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Video generation result:", data);

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">📸</span>
            <span className="text-3xl">🖼️</span>
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

            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* File Upload */}
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

            {/* Drawing Type */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                🔹 Choose What's in the Drawing:
              </label>
              <Select value={drawingType} onValueChange={setDrawingType}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select drawing type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="animal">Animal</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="monster">Monster</SelectItem>
                  <SelectItem value="fantasy-creature">Fantasy Creature</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                🔹 Choose What It Does:
              </label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walks-forward">Walks forward</SelectItem>
                  <SelectItem value="runs-forward">Runs forward</SelectItem>
                  <SelectItem value="flies-forward">Flies forward</SelectItem>
                  <SelectItem value="drives-forward">Drives forward</SelectItem>
                  <SelectItem value="jumps-happily">Jumps happily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Environment */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                🔹 Choose Environment:
              </label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select environment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="city-street">City street</SelectItem>
                  <SelectItem value="racetrack">Racetrack</SelectItem>
                  <SelectItem value="sky">Sky</SelectItem>
                  <SelectItem value="magical-world">Magical world</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <LoaderCircle className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <Play className="w-6 h-6 mr-2" />
              )}
              {loading ? "Generating..." : "Generate Video"}
            </Button>

            {/* Video Result */}
            {videoUrl && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center border-2 border-dashed border-gray-300">
                <video controls src={videoUrl} className="mx-auto rounded-lg mb-4" />
                <a
                  href={videoUrl}
                  download
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Video
                </a>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;
