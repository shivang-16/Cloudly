"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, FolderPlus, FileUp, FolderUp } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { NewFolderModal } from "./new-folder-modal";
import { createFolderAction } from "../drive/_actions/drive.actions";
import { useUpload } from "../_context/upload-context";

const STORAGE_LIMIT_GB = 20;
const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

export function MobileFab() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const { addFiles, addFolderFiles, uploads } = useUpload();
  
  // Need to get storage info if we want to enforce limits like sidebar
  // For now, assuming optimistic check or server validation
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addFiles(files);
      e.target.value = "";
    }
  };

  // Handle Folder Upload
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFolderFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Get current folder ID
  const getCurrentFolderId = (): string | undefined => {
    const match = pathname.match(/\/drive\/folders\/([^\/]+)/);
    return match ? match[1] : undefined;
  };

  const handleCreateFolder = async (name: string) => {
    const parentFolderId = getCurrentFolderId();
    try {
        const result = await createFolderAction(name, parentFolderId);
        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to create folder" };
    }
  };

  // Calculate bottom position based on UploadPanel state
  // If upload panel is visible (fixed at bottom), we need to move FAB up
  const hasActiveUploads = uploads.length > 0;
  
  return (
    <>
      <div 
        className={clsx(
          "fixed right-6 z-40 lg:hidden flex flex-col items-end gap-4 transition-all duration-300",
          hasActiveUploads ? "bottom-20 sm:bottom-24" : "bottom-6"
        )}
        ref={menuRef}
      >
        {/* Menu Options - Slide up animation */}
        <div 
            className={clsx(
                "flex flex-col gap-3 transition-all duration-200 origin-bottom-right",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10 pointer-events-none absolute bottom-16 right-0"
            )}
        >
            <button
                onClick={() => {
                    folderInputRef.current?.click();
                    setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 px-4 py-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 font-medium whitespace-nowrap"
            >
                <FolderUp size={20} className="text-gray-500 dark:text-gray-400" />
                Folder upload
            </button>
            
             <button
                onClick={() => {
                    fileInputRef.current?.click();
                    setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 px-4 py-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 font-medium whitespace-nowrap"
            >
                <FileUp size={20} className="text-gray-500 dark:text-gray-400" />
                File upload
            </button>

            <button
                onClick={() => {
                   setIsNewFolderModalOpen(true);
                   setIsOpen(false);
                }}
                className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 px-4 py-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 font-medium whitespace-nowrap"
            >
                <FolderPlus size={20} className="text-gray-500 dark:text-gray-400" />
                New folder
            </button>
        </div>

        {/* FAB Trigger - mimicking Google Drive style */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-white dark:bg-[#1e1e1e] rounded-[16px] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-transparent dark:border-gray-600"
            aria-label="Create new"
        >
             <Plus 
                size={24} 
                className={clsx(
                    "text-gray-600 dark:text-gray-200 transition-transform duration-300", 
                    isOpen && "rotate-45"
                )} 
             />
        </button>
      </div>

      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        onChange={handleFolderUpload} 
        className="hidden" 
        {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)} 
      />

       <NewFolderModal 
          isOpen={isNewFolderModalOpen} 
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={handleCreateFolder}
        />
    </>
  );
}
