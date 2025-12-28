"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Search, Menu, Sun, Moon, X } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "../_context/sidebar-context";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const lastPushedRef = useRef(initialSearch);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Navigate to search results on debounced query change
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    
    // Only push if the value actually changed from what we last pushed
    if (trimmed !== lastPushedRef.current) {
      lastPushedRef.current = trimmed;
      if (trimmed) {
        router.push(`/drive?search=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/drive');
      }
    }
  }, [debouncedSearch, router]);

  const clearSearch = () => {
    setSearchQuery("");
    lastPushedRef.current = "";
    router.push('/drive');
  };

  return (
    <div className="flex-1 max-w-4xl px-2 md:px-8">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={24} className="text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 md:pl-12 md:pr-12 py-2 md:py-3 rounded-full bg-[#f1f3f4] dark:bg-[#282a2c] focus:bg-white dark:focus:bg-[#1e1e1e] border border-transparent focus:border-transparent focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200 text-sm sm:text-base transition-all shadow-none focus:shadow-md"
          placeholder="Search in Cloudly"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
          {searchQuery && (
            <button onClick={clearSearch} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { toggle } = useSidebar();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 py-2 bg-white dark:bg-[#18191a] border-b border-transparent dark:border-gray-800 transition-colors">
      <div className="flex items-center gap-3 w-60">
        <button 
          onClick={toggle}
          className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:hidden"
        >
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <Link href="/drive" className="flex items-center gap-1 md:gap-2">
           <img 
            src="/cloudly_logo.png" 
            alt="Cloudly" 
            className="w-10 h-auto md:w-16 md:h-15"
          />
          <span className="text-xl font-normal text-gray-600 dark:text-gray-200 hidden md:block">Cloudly</span>
        </Link>
      </div>

      <Suspense fallback={
        <div className="flex-1 max-w-2xl px-4">
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>
        </div>
      }>
        <HeaderSearch />
      </Suspense>

      <div className="flex items-center gap-2 pl-4">
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
               {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <div className="pl-3 flex items-center gap-3">
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
