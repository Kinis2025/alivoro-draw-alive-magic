
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "My daughter screamed with joy seeing her drawing come to life.",
      author: "Emily R.",
      rating: 5
    },
    {
      quote: "Finally, a creative use of AI that actually brings happiness.",
      author: "Jacob L.",
      rating: 5
    },
    {
      quote: "The magic in my son's eyes was priceless when he saw his dragon fly.",
      author: "Sarah M.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Parents Are Saying
          </h2>
          <p className="text-xl text-gray-600">
            Real families sharing their magical moments
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-4 font-medium leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-purple-600 font-semibold">
                  – {testimonial.author}
                </cite>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
