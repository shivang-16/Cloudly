"use client";

import React from "react";
import { FileText, MoreVertical, Folder } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { format } from "date-fns";
import { DriveItem } from "../_actions/drive.actions";
import { useRouter } from "next/navigation";

interface FileListProps {
  initialFolders?: DriveItem[];
  initialFiles?: DriveItem[];
}

export function FileList({ initialFolders = [], initialFiles = [] }: FileListProps) {
  const router = useRouter();
  const items = [...initialFolders, ...initialFiles];

  if (items.length === 0) {
    return <EmptyState />;
  }

  const formatSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return "—"; // Folder
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleItemClick = (item: DriveItem) => {
    if (item.type === "folder") {
      router.push(`/drive/folders/${item.id}`);
    } else {
      // TODO: Handle file click (preview/download)
      console.log("File clicked:", item.name);
    }
  };

  return (
    <div className="mt-8 flex-1 flex flex-col min-h-0">
      <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 px-4">Files</h2>
      
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="grid grid-cols-[3fr,1.5fr,1.5fr,1fr] gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] sticky top-0 z-10">
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:block">Date modified</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block text-right">File size</div>
        </div>

        {/* File Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto">
           {items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="group grid grid-cols-[3fr,1.5fr,1.5fr,1fr] gap-4 px-4 py-3 hover:bg-blue-50 dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors items-center"
              >
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-8 h-8 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {item.type === "folder" ? (
                             <Folder size={16} className="fill-gray-500 dark:fill-gray-400 text-gray-500 dark:text-gray-400" />
                        ) : (
                             <FileText size={16} className="text-blue-500" />
                        )}
                     </div>
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        {item.name}
                     </span>
                  </div>
                  
                   <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                          {item.owner === "me" ? "Me" : item.owner.charAt(0).toUpperCase()}
                       </div>
                       {item.owner === "me" ? "me" : item.owner}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                     {format(new Date(item.updatedAt), "dd MMM yyyy")} {item.owner === "me" ? "me" : ""}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block truncate text-right">
                     {formatSize(item.size)}
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="hidden group-hover:flex absolute right-4 items-center gap-1 bg-white/50 dark:bg-[#2d2d2d]/50 backdrop-blur-sm p-1 rounded-full shadow-sm">
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                          <MoreVertical size={16} />
                      </button>
                  </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
