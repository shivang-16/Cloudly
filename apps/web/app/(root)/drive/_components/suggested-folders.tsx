"use client";

import React from "react";
import { Folder, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuggestedFolder {
  id: string;
  name: string;
}

interface SuggestedFoldersProps {
  folders: SuggestedFolder[];
}

export function SuggestedFolders({ folders }: SuggestedFoldersProps) {
  const router = useRouter();
  
  // Don't render if no folders
  if (!folders || folders.length === 0) {
    return null;
  }

  // Show only top 5
  const topFolders = folders.slice(0, 5);

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 px-1">Suggested folders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {topFolders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => router.push(`/drive/folders/${folder.id}`)}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors group"
          >
            <Folder size={24} className="text-gray-600 dark:text-gray-400 fill-current" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-700 dark:text-gray-200 truncate">
                {folder.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                in My Drive
              </div>
            </div>
             <button 
               onClick={(e) => e.stopPropagation()}
               className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded-full transition-all"
             >
               <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

