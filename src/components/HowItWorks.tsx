
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Play, Video, Share2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload the Drawing",
      description: "Snap a photo or upload your child's drawing directly from your phone or computer.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Play,
      title: "Choose the Animation",
      description: "Select what your drawing does – runs, flies, drives – and the environment it comes to life in.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Video,
      title: "Generate the Video",
      description: "Alivoro's AI brings the drawing to life as a realistic video, ready to watch and share.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Share2,
      title: "Share the Magic",
      description: "Download the video or share it instantly with family and friends.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🎨</span>
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Alivoro Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to transform your child's imagination into reality
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
