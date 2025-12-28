"use client";

import React, { useState, useRef, useCallback } from "react";
import { useUpload } from "../_context/upload-context";
import { Upload, Folder } from "lucide-react";

interface DragDropZoneProps {
  children: React.ReactNode;
}

export function DragDropZone({ children }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"file" | "folder">("file");
  const { addFiles, addFolderFiles } = useUpload();
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
      
      // Check if any item is a folder
      const items = Array.from(e.dataTransfer.items);
      const hasFolder = items.some(item => {
        const entry = item.webkitGetAsEntry?.();
        return entry?.isDirectory;
      });
      setDragType(hasFolder ? "folder" : "file");
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Recursively read directory entries
  const readDirectory = async (dirEntry: FileSystemDirectoryEntry): Promise<File[]> => {
    const files: File[] = [];
    const dirReader = dirEntry.createReader();
    
    const readEntries = (): Promise<FileSystemEntry[]> => {
      return new Promise((resolve, reject) => {
        dirReader.readEntries(resolve, reject);
      });
    };

    const getFile = (fileEntry: FileSystemFileEntry): Promise<File> => {
      return new Promise((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
    };

    let entries = await readEntries();
    while (entries.length > 0) {
      for (const entry of entries) {
        if (entry.isFile) {
          const file = await getFile(entry as FileSystemFileEntry);
          // Add webkitRelativePath-like property for folder name extraction
          Object.defineProperty(file, 'webkitRelativePath', {
            value: `${dirEntry.name}/${entry.name}`,
            writable: false
          });
          files.push(file);
        }
        // Note: We don't recurse into subdirectories for simplicity
      }
      entries = await readEntries();
    }
    
    return files;
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const items = e.dataTransfer.items;
    
    if (items && items.length > 0) {
      const filesFromDrop: File[] = [];
      let folderEntry: FileSystemDirectoryEntry | null = null;

      // Check for folders using webkitGetAsEntry
      for (let i = 0; i < items.length; i++) {
        const entry = items[i]?.webkitGetAsEntry?.();
        if (entry) {
          if (entry.isDirectory) {
            folderEntry = entry as FileSystemDirectoryEntry;
            break; // Handle first folder only
          } else if (entry.isFile) {
            const file = e.dataTransfer.files[i];
            if (file) filesFromDrop.push(file);
          }
        }
      }

      if (folderEntry) {
        // Handle folder drop - read files and create folder
        const filesInFolder = await readDirectory(folderEntry);
        if (filesInFolder.length > 0) {
          addFolderFiles(filesInFolder);
        }
      } else if (filesFromDrop.length > 0) {
        // Handle regular file drop
        addFiles(filesFromDrop);
      } else if (e.dataTransfer.files.length > 0) {
        // Fallback to regular files
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
      }
    }
    
    e.dataTransfer.clearData();
  }, [addFiles, addFolderFiles]);

  return (
    <div
      className="relative h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-500 rounded-lg transition-all">
          <div className="flex flex-col items-center gap-4 text-blue-600 dark:text-blue-400">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              {dragType === "folder" ? (
                <Folder size={40} className="text-blue-500" />
              ) : (
                <Upload size={40} className="text-blue-500" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xl font-medium">
                {dragType === "folder" ? "Drop folder to upload" : "Drop files to upload"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {dragType === "folder" ? "Max 10 files per folder" : "Up to 10 files at a time"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

