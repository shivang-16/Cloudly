"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Globe, Lock, Link2, Check, X } from "lucide-react";
import { updateFileShareAction } from "../_actions/file.actions";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    isPublic: boolean;
  };
}

export function ShareModal({ isOpen, onClose, file }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(file.isPublic);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setIsPublic(file.isPublic);
    if (file.isPublic) {
      setPublicUrl(`${window.location.origin}/public/file/${file.id}`);
    }
  }, [file]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleToggleShare = async (newIsPublic: boolean) => {
    setIsLoading(true);
    setIsDropdownOpen(false);
    
    const result = await updateFileShareAction(file.id, newIsPublic);
    
    if (result.success) {
      setIsPublic(newIsPublic);
      if (newIsPublic) {
        // Use direct API stream URL for public files
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        setPublicUrl(`${apiUrl}/api/files/public/${file.id}/stream`);
      } else {
        setPublicUrl(null);
      }
      toast.success(newIsPublic ? "Anyone with the link can view" : "File is now private");
    } else {
      toast.error(result.error || "Failed to update sharing");
    }
    
    setIsLoading(false);
  };

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard");
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Share "{file.name}"
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            General access
          </h3>
          
          {/* Access Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                {isPublic ? <Globe size={20} /> : <Lock size={20} />}
              </div>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded disabled:opacity-50"
                >
                  {isPublic ? "Anyone with the link" : "Restricted"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 px-2">
                  {isPublic ? "Anyone on the Internet with the link can view" : "Only you can access"}
                </p>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button 
                      onClick={() => handleToggleShare(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {!isPublic && <Check size={16} className="text-blue-600" />}
                      {!isPublic ? "" : <span className="w-4" />}
                      Restricted
                    </button>
                    <button 
                      onClick={() => handleToggleShare(true)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {isPublic && <Check size={16} className="text-blue-600" />}
                      {isPublic ? "" : <span className="w-4" />}
                      Anyone with the link
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {isPublic && (
              <span className="text-sm text-gray-500">Viewer</span>
            )}
          </div>

          {/* Info Box */}
          {isPublic && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Viewers of this file can view and download
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleCopyLink}
            disabled={!isPublic}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isCopied 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-300 dark:border-green-700' 
                : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-300 dark:border-gray-600'
            }`}
          >
            <Link2 size={18} />
            {isCopied ? 'Copied!' : 'Copy link'}
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
