"use client";

import React, { useState } from "react";

const features = [
  {
    title: "Storage that grows with you",
    description: "Scale your storage effortlessly from 20 GB to 5 TB per user, plus the ability to request additional storage. Storage costs vary.",
  },
  {
    title: "Gmail attachments straight to Drive",
    description: "Save email attachments directly to your Cloudly Drive with one click. Keep all your important files organized and easily accessible.",
  },
  {
    title: "Scan documents with Drive",
    description: "Use your phone's camera to scan receipts, documents, and notes. Cloudly automatically converts them to searchable PDFs.",
  }
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[44px] leading-tight text-[#202124] mb-6 font-medium tracking-tight">
            Cloud storage made easy
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#5f6368] leading-relaxed">
            Simple and scalable cloud storage for people, and for teams of all sizes. Upload, open, share and edit files from any device.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-24">
          
          {/* Left Side - Feature List */}
          <div className="flex-1 w-full md:max-w-[450px] space-y-4">
             {features.map((feature, index) => (
                <div 
                  key={index}
                  className="cursor-pointer group"
                  onClick={() => setActiveFeature(index)}
                >
                    <div className={`flex gap-6 p-4 rounded-xl transition-all duration-300 ${activeFeature === index ? 'bg-white' : ''}`}>
                        {/* Active Indicator Line */}
                        <div className={`w-1 rounded-full transition-all duration-300 ${activeFeature === index ? 'bg-[#1a73e8] h-auto' : 'bg-[#dadce0] group-hover:bg-[#1a73e8] h-12'}`}></div>
                        
                        <div className="flex-1 py-1">
                            <h3 className={`text-xl font-medium mb-3 transition-colors ${activeFeature === index ? 'text-[#202124]' : 'text-[#5f6368] group-hover:text-[#202124]'}`}>
                                {feature.title}
                            </h3>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFeature === index ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-[#5f6368] leading-relaxed text-[16px]">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
             ))}
          </div>

          {/* Right Side - Image */}
          <div className="flex-1 w-full">
            <div className="relative rounded-[24px] overflow-hidden shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] bg-white border border-[#f1f3f4] aspect-[4/3] flex items-center justify-center p-8">
               <img 
                 src="/landing2.webp" 
                 alt="Cloudly Features" 
                 className="w-full h-full object-contain"
               />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
