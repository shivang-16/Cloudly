"use client";

import React from "react";
import { Search, Settings, HelpCircle, Menu, SlidersHorizontal, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 py-2 bg-white dark:bg-[#18191a]">
      <div className="flex items-center gap-3 w-60">
        <div className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:hidden">
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
        </div>
        <Link href="/drive" className="flex items-center gap-2">
           <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" 
            alt="Google Drive" 
            className="w-8 h-8"
          />
          <span className="text-xl font-normal text-gray-600 dark:text-gray-200">Drive</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-3 rounded-full bg-[#e9eef6] dark:bg-[#282a2c] focus:bg-white dark:focus:bg-[#1e1e1e] border border-transparent focus:border-transparent focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200 sm:text-base transition-all shadow-sm focus:shadow-md"
            placeholder="Search in Drive"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
            <SlidersHorizontal size={20} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-4">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
               <HelpCircle size={24} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
               <Settings size={24} />
            </button>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
               {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <div className="pl-3 flex items-center gap-3">
            {/* Clerk User Button */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
      </div>
    </header>
  );
}
