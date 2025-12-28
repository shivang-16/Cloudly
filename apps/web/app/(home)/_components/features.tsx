"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";

const tabs = [
  "Gemini in Drive",
  "Store",
  "Manage",
  "Collaborate",
  "Security",
  "Download",
  "Customers",
  "FAQ"
];

export function Features() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-12 bg-white dark:bg-[#18191a]">
      {/* Navigation Pills */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mb-20 overflow-x-auto">
        <div className="flex items-center gap-2 justify-start md:justify-center min-w-max bg-white dark:bg-[#1e1e1e] p-1 rounded-full border border-[#dadce0] dark:border-[#444746] shadow-sm mx-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-200 ${
                activeTab === index 
                  ? "bg-white dark:bg-[#303134] text-[#202124] dark:text-[#e3e3e3] shadow-md z-10" 
                  : "text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2d2d]"
              }`}
            >
              {activeTab === index && index === 0 ? (
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                    {tab}
                 </span>
              ) : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 mb-32">
          {/* Left Side - Image/UI Mockup */}
          <div className="flex-1 w-full order-last md:order-first">
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.08)] bg-[#f8f9fa] dark:bg-[#1e1e1e] border border-[#f1f3f4] dark:border-[#444746] aspect-[4/3] flex items-center justify-center p-8">
               {/* Gemini UI Mockup */}
               <div className="relative w-full h-full bg-white dark:bg-[#18191a] rounded-2xl shadow-sm border border-[#e8eaed] dark:border-[#444746] overflow-hidden">
                    {/* Header */}
                    <div className="h-16 border-b border-[#f1f3f4] dark:border-[#444746] flex items-center px-6 gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#e8f0fe] dark:bg-[#1a73e8] flex items-center justify-center text-[#1a73e8] dark:text-white">
                           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                        </div>
                        <span className="font-medium text-[#202124] dark:text-[#e3e3e3]">Gemini</span>
                    </div>

                    {/* Gemini Chat Area */}
                    <div className="p-8">
                        <h3 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] mb-2">Hello, Greg</h3>
                        <p className="text-2xl text-[#bcbcbc] dark:text-[#80868b] mb-8">How can I help you today?</p>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#303134] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] cursor-pointer transition-colors flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-white dark:bg-[#18191a] flex items-center justify-center shadow-sm">
                                  <svg className="w-5 h-5 text-[#5f6368] dark:text-[#9aa0a6]" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                               </div>
                               <span className="font-medium text-[#202124] dark:text-[#e3e3e3]">Learn about a file</span>
                            </div>
                            <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#303134] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] cursor-pointer transition-colors flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#18191a] flex items-center justify-center shadow-sm">
                                  <svg className="w-5 h-5 text-[#5f6368] dark:text-[#9aa0a6]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                               </div>
                               <span className="font-medium text-[#202124] dark:text-[#e3e3e3]">Summarize a topic</span>
                            </div>
                        </div>
                    </div>
               </div>
               
                {/* Floating file snippet */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 bg-white dark:bg-[#303134] p-3 rounded-lg shadow-lg border border-[#f1f3f4] dark:border-[#444746] max-w-[200px] animate-[float_4s_ease-in-out_infinite]">
                   <div className="flex items-center gap-2 mb-2">
                       <div className="w-4 h-4 rounded-sm bg-[#ea4335]"></div>
                       <div className="h-2 bg-[#f1f3f4] dark:bg-[#5f6368] w-20 rounded"></div>
                   </div>
                   <div className="space-y-1">
                       <div className="h-1.5 bg-[#f1f3f4] dark:bg-[#5f6368] w-full rounded"></div>
                       <div className="h-1.5 bg-[#f1f3f4] dark:bg-[#5f6368] w-3/4 rounded"></div>
                   </div>
               </div>
            </div>
          </div>

          {/* Right Side - Features Text */}
          <div className="flex-1 md:pl-8">
            <h2 className="text-[36px] md:text-[48px] leading-[1.1] text-[#202124] dark:text-[#e3e3e3] mb-6 font-medium tracking-tight">
              Make smarter decisions <br /> with Gemini in Drive
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#5f6368] dark:text-[#9aa0a6] mb-8 leading-relaxed font-normal">
              Gain valuable insights by summarising long documents, synthesising information and retrieving quick facts about your content without having to search through multiple files. See what else Gemini can help you do and try <a href="#" className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium hover:underline">Google Workspace with Gemini</a>.
            </p>
            <div className="flex justify-center md:justify-start"> 
                <button className="w-14 h-14 rounded-full border-[2px] border-[#1a73e8] dark:border-[#8ab4f8] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#e8f0fe] dark:hover:bg-[#1e1e1e] transition-colors">
                    <Play className="fill-current" size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
