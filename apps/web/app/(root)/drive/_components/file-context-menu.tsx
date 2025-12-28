"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, ExternalLink, Download, Pencil, Share2, Trash2, X, Check } from "lucide-react";
import { downloadFileAction, renameFileAction, deleteFileAction } from "../_actions/file.actions";
import { ShareModal } from "./share-modal";
import { toast } from "sonner";

interface FileContextMenuProps {
  file: {
    id: string;
    name: string;
    isPublic?: boolean;
  };
}

export function FileContextMenu({ file }: FileContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open file in new tab - use public endpoint for public files, auth endpoint for private
    if (file.isPublic) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      window.open(`${apiUrl}/api/files/public/${file.id}/stream`, '_blank');
    } else {
      window.open(`/api/files/${file.id}/stream`, '_blank');
    }
    setIsOpen(false);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsLoading(true);
    
    const result = await downloadFileAction(file.id);
    
    if (result.success && result.downloadUrl) {
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName || file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error(result.error || "Failed to download file");
    }
    
    setIsLoading(false);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsRenaming(true);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newName.trim() || newName === file.name) {
      setIsRenaming(false);
      return;
    }
    
    setIsLoading(true);
    const result = await renameFileAction(file.id, newName.trim());
    
    if (result.success) {
      toast.success("File renamed");
    } else {
      toast.error(result.error || "Failed to rename file");
      setNewName(file.name);
    }
    
    setIsRenaming(false);
    setIsLoading(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsShareModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    
    if (!confirm("Move this file to trash?")) return;
    
    setIsLoading(true);
    const result = await deleteFileAction(file.id);
    
    if (result.success) {
      toast.success("File moved to trash");
    } else {
      toast.error(result.error || "Failed to delete file");
    }
    
    setIsLoading(false);
  };

  // Rename inline editor
  if (isRenaming) {
    return (
      <form onSubmit={handleRenameSubmit} onClick={e => e.stopPropagation()} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => setIsRenaming(false)}
          className="px-2 py-1 text-sm border border-blue-500 rounded bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <Check size={16} className="text-green-500" />
        </button>
        <button type="button" onClick={() => setIsRenaming(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <X size={16} className="text-red-500" />
        </button>
      </form>
    );
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          disabled={isLoading}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 disabled:opacity-50"
        >
          <MoreVertical size={16} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            <button 
              onClick={handleOpen}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <ExternalLink size={16} />
              Open
            </button>
            <button 
              onClick={handleDownload}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Download size={16} />
              Download
            </button>
            <button 
              onClick={handleRename}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Pencil size={16} />
              Rename
            </button>
            <button 
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Share2 size={16} />
              Share
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            <button 
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} />
              Move to trash
            </button>
          </div>
        )}
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        file={{ id: file.id, name: file.name, isPublic: file.isPublic || false }}
      />
    </>
  );
}
