"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Home,
  Star,
  Trash2,
  FolderPlus,
  FileUp,
  FolderUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NewFolderModal } from "./new-folder-modal";
import { createFolderAction } from "../drive/_actions/drive.actions";
import { useUpload } from "../_context/upload-context";
import { useSidebar } from "../_context/sidebar-context";

const navItems = [
  { name: "Home", icon: Home, href: "/drive" },
  { name: "Starred", icon: Star, href: "/drive/starred" },
  { name: "Bin", icon: Trash2, href: "/drive/bin" },
];

const STORAGE_LIMIT_GB = 20;
const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

export function Sidebar({ storageUsed = 0 }: { storageUsed?: number }) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const { addFiles, addFolderFiles } = useUpload();

  const storagePercentage = Math.min((storageUsed / STORAGE_LIMIT_BYTES) * 100, 100);
  const isStorageFull = storageUsed >= STORAGE_LIMIT_BYTES;

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const k = 1024;
    const mb = bytes / (k * k);
    const gb = bytes / (k * k * k);
    // Show MB until we reach 1 GB
    if (gb < 1) return mb.toFixed(1) + " MB";
    return gb.toFixed(2) + " GB";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle File Upload - use upload context
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStorageFull) {
      alert("Storage is full. Please delete some files to upload more.");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addFiles(files);
      e.target.value = "";
    }
  };

  // Handle Folder Upload - use upload context
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStorageFull) {
      alert("Storage is full. Please delete some files to upload more.");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      addFolderFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Extract current folder ID from URL if we're inside a folder
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

  const NavItem = ({ name, icon: Icon, href }: { name: string; icon: React.ElementType; href: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-3 px-4 py-2 rounded-r-full text-sm font-medium transition-colors mb-0.5 mr-4",
          isActive
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <Icon size={18} className={clsx(isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400")} />
        {name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <aside 
        className={clsx(
          "flex flex-col pt-2 pb-4 overflow-y-auto bg-white dark:bg-[#18191a] transition-transform duration-300 ease-in-out z-30",
          "fixed inset-y-0 left-0 w-64 h-full",
          "lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Hidden Inputs for File/Folder Upload */}
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

        <div className="pl-3 mb-6 relative" ref={menuRef}>
          <button 
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              disabled={isStorageFull}
              className={clsx(
                "flex items-center gap-3 bg-white dark:bg-[#1e1e1e] shadow-md dark:shadow-none dark:border-gray-600 border border-transparent dark:border rounded-2xl px-4 py-4 transition-all",
                isStorageFull 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-gray-50 dark:hover:bg-[#2d2d2d] active:shadow-sm"
              )}
          >
            <Plus size={24} className="text-gray-600 dark:text-gray-200" />
            <span className="font-medium text-gray-700 dark:text-gray-200">New</span>
          </button>

          {isNewMenuOpen && !isStorageFull && (
              <div className="absolute top-full left-4 mt-1 w-64 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={() => {
                        setIsNewFolderModalOpen(true);
                        setIsNewMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-[#202124] dark:text-[#e3e3e3]"
                  >
                      <FolderPlus size={20} className="text-gray-500 dark:text-gray-400" />
                      New folder
                  </button>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                  
                  <button 
                     onClick={() => {
                         fileInputRef.current?.click();
                         setIsNewMenuOpen(false);
                     }}
                     className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-[#202124] dark:text-[#e3e3e3]"
                  >
                      <FileUp size={20} className="text-gray-500 dark:text-gray-400" />
                      File upload
                  </button>
                  <button 
                      onClick={() => {
                          folderInputRef.current?.click();
                          setIsNewMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-[#202124] dark:text-[#e3e3e3]"
                  >
                      <FolderUp size={20} className="text-gray-500 dark:text-gray-400" />
                      Folder upload
                  </button>
              </div>
          )}
        </div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}
        </nav>

        {/* Storage Progress */}
        <div className="px-6 mt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {formatStorage(storageUsed)} of {STORAGE_LIMIT_GB} GB used
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4 overflow-hidden">
            <div 
              className={clsx(
                "h-1.5 rounded-full transition-all",
                storagePercentage > 90 ? "bg-red-500" : storagePercentage > 70 ? "bg-yellow-500" : "bg-blue-600"
              )} 
              style={{ width: `${Math.max(storagePercentage, 1)}%` }}
            />
          </div>
          {isStorageFull && (
            <p className="text-xs text-red-500 mb-2">Storage full! Delete files to upload more.</p>
          )}
        </div>

        {/* Modals */}
        <NewFolderModal 
          isOpen={isNewFolderModalOpen} 
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </aside>
    </>
  );
}

