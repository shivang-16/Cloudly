"use client";

import React from "react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="relative w-[280px] h-[200px] mb-8">
        <img 
            src="/empty-state.png" 
            alt="No files" 
            className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-[22px] font-normal text-[#202124] dark:text-[#e3e3e3] mb-2">
        Drop files here
      </h3>
      <p className="text-[14px] text-[#5f6368] dark:text-[#9aa0a6] mb-6">
        or use the &apos;New&apos; button.
      </p>
    </div>
  );
}
