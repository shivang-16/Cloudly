"use client";

import React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-8 max-w-[1280px] mx-auto overflow-visible bg-white">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 max-w-[600px] text-center md:text-left z-10">
{/* Logo removed - moved to Navbar */}
          <h1 className="text-[40px] md:text-[64px] leading-[1.1] text-[#202124] mb-6 font-medium tracking-tight">
            Store and share <br /> files online
          </h1>
          <p className="text-lg md:text-[22px] leading-relaxed text-[#5f6368] mb-10 max-w-[540px]">
            Secure cloud storage with 20GB free. Upload, share, and access your files from anywhere.
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
               className="inline-flex justify-center items-center px-8 h-12 bg-white text-[#1a73e8] border border-[#dadce0] text-[16px] font-medium rounded-full hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-all min-w-[180px]"
            >
              Get started free
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center">
            {/* Main Dashboard Image */}
           <div className="relative w-full max-w-[800px] aspect-[4/3] md:translate-x-12 lg:translate-x-16">
             <img 
               src="/landing1.jpg"
               alt="Cloudly Dashboard" 
               className="w-full h-full object-contain"
             />
           </div>
        </div>
      </div>
    </section>
  );
}
