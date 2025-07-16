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
  const [environment, setEnvironment] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [action] = useState('moves');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStripeCheckout = async () => {
    if (!selectedFile || !environment) {
      setError("Please upload a drawing and choose an environment before payment.");
      return;
    }

    const duration = "5";
    const ratio = "720:1280";

    try {
      setLoading(true);

      const uniqueFileName = `${uuidv4()}_${selectedFile.name}`;
      const storageRef = ref(storage, `uploads/${uniqueFileName}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Uploaded to Firebase. Download URL:", downloadURL);

      // ✅ Save data for use in /checkout-success page
      localStorage.setItem("uploadedImageUrl", downloadURL);
      localStorage.setItem("action", action);
      localStorage.setItem("environment", environment);
      localStorage.setItem("duration", duration);
      localStorage.setItem("ratio", ratio);

      const res = await fetch("https://alivoro-server.onrender.com/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Payment could not be initiated.");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setError("Payment error. Try again later.");
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

            {/* Environment selection */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-900">🔹 Choose Environment:</label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select environment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="meadow">Meadow</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="mountain">Mountain</SelectItem>
                  <SelectItem value="road">Road</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stripe Checkout Button */}
            <Button
              onClick={handleStripeCheckout}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all"
              disabled={loading}
            >
              💳 Buy Video (2€)
            </Button>

            {/* Video Output after direct generation (for testing only) */}
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
