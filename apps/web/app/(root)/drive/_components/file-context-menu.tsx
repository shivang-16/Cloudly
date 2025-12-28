"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, ExternalLink, Download, Share2, Trash2, Star } from "lucide-react";
import { downloadFileAction, deleteFileAction } from "../_actions/file.actions";
import { ShareModal } from "./share-modal";
import { toast } from "sonner";
import { apiPatch } from "../../../../lib/api-client";
import { useRouter } from "next/navigation";

interface FileContextMenuProps {
  file: {
    id: string;
    name: string;
    isPublic?: boolean;
    isStarred?: boolean;
  };
}

export function FileContextMenu({ file }: FileContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(file.isStarred || false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, showAbove: false });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleScroll() {
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < 280;
      
      setMenuPosition({
        top: showAbove ? rect.top : rect.bottom + 4,
        left: rect.right - 192, // 192px = w-48 = 12rem
        showAbove,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsLoading(true);
    
    try {
      const res = await apiPatch(`/api/files/${file.id}/star`);
      const data = await res.json();
      
      if (res.ok) {
        setIsStarred(data.file.isStarred);
        toast.success(data.file.isStarred ? "Added to starred" : "Removed from starred");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update star");
      }
    } catch {
      toast.error("Failed to update star");
    }
    
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
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete file");
    }
    
    setIsLoading(false);
  };

  const menuContent = isOpen && typeof document !== 'undefined' ? createPortal(
    <div 
      ref={menuRef}
      style={{
        position: 'fixed',
        top: menuPosition.showAbove ? 'auto' : menuPosition.top,
        bottom: menuPosition.showAbove ? window.innerHeight - menuPosition.top + 4 : 'auto',
        left: menuPosition.left,
      }}
      className="w-48 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-[9999]"
    >
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
        onClick={handleStar}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        <Star size={16} className={isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
        {isStarred ? "Unstar" : "Star"}
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
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="relative">
        <button 
          ref={buttonRef}
          onClick={handleToggleMenu}
          disabled={isLoading}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 disabled:opacity-50"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {menuContent}

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        file={{ id: file.id, name: file.name, isPublic: file.isPublic || false }}
      />
    </>
  );
}
