"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-8 max-w-[1280px] mx-auto overflow-visible">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 max-w-[600px] text-center md:text-left z-10">
          <h1 className="text-[40px] md:text-[64px] leading-[1.1] text-[#202124] dark:text-[#e3e3e3] mb-6 font-medium tracking-tight">
            Store and share <br /> files online
          </h1>
          <p className="text-lg md:text-[22px] leading-relaxed text-[#5f6368] dark:text-[#9aa0a6] mb-10 max-w-[540px]">
            AI-powered, secure cloud storage for seamless file sharing and enhanced collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
             <Link
                href="/sign-in"
                className="inline-flex justify-center items-center px-8 h-12 bg-[#1a73e8] text-white text-[16px] font-medium rounded-full hover:bg-[#1867d6] transition-all shadow-none hover:shadow-md min-w-[120px]"
            >
                Sign in
            </Link>
            <Link
               href="/sign-up"
               className="inline-flex justify-center items-center px-8 h-12 bg-white dark:bg-transparent text-[#1a73e8] dark:text-[#8ab4f8] border border-[#dadce0] dark:border-[#5f6368] text-[16px] font-medium rounded-full hover:bg-[#f8f9fa] dark:hover:bg-[#303134] hover:border-[#d2e3fc] transition-all min-w-[180px]"
            >
              Try Drive for work
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center">
            {/* Main Dashboard Image */}
           <div className="relative w-full max-w-[800px] aspect-[4/3] md:translate-x-12 lg:translate-x-16">
             <div className="rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] bg-white dark:bg-[#1e1e1e] border border-[#f1f3f4] dark:border-[#444746]">
                 {/* Placeholder for the complex drive dashboard UI */}
                 {/* Using a solid color block setup to simulate the UI structure if actual image is missing, but trying to use a reliable external image URL first */}
                 <img 
                   src="https://lh3.googleusercontent.com/u0q2Rj-CENo61JkS8u998QdY2M0gq-Jdh_jXXtJqN-C1gT2eF-E7qFq5XJ4r6-hZ-c0=w1000-rw"
                   alt="Google Drive Dashboard" 
                   className="w-full h-full object-cover dark:opacity-90"
                 />
             </div>
             
             {/* Security Shield Floating Element */}
             <div className="absolute -left-8 bottom-12 p-4 bg-[#e8f0fe] dark:bg-[#1a73e8] rounded-[24px] shadow-lg animate-[bounce_4s_infinite]">
                 <div className="w-12 h-12 bg-[#1a73e8] dark:bg-white rounded-full flex items-center justify-center p-2">
                     {/* Shield Icon SVG */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-white dark:text-[#1a73e8] w-8 h-8">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.95-7 10.18-3.87-1.23-7-5.51-7-10.18V6.3l7-3.12z"/>
                        <path d="M12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fillOpacity="0.3"/>
                    </svg>
                 </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
