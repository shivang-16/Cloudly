"use client";

import React, { useState, useEffect, useTransition } from "react";
import { FileText, Folder, Image, FileSpreadsheet, Presentation, Video, Music, Archive, Code, File, MoreVertical, Loader2 } from "lucide-react";
import { EmptyState } from "../../_components/empty-state";
import { format } from "date-fns";
import { DriveItem, getDriveItemsAction } from "../_actions/drive.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { FileContextMenu } from "./file-context-menu";

interface FileListProps {
  initialFolders?: DriveItem[];
  initialFiles?: DriveItem[];
  hasMoreFiles?: boolean;
  hasMoreFolders?: boolean;
  currentPage?: number;
  searchQuery?: string;
}

// Get icon and color based on file extension/mimeType
const getFileIcon = (name: string, mimeType?: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  
  // PDF
  if (ext === 'pdf' || mimeType?.includes('pdf')) {
    return { icon: FileText, bgColor: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600' };
  }
  
  // Spreadsheets (Excel, Google Sheets, CSV)
  if (['xlsx', 'xls', 'csv', 'numbers'].includes(ext) || mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) {
    return { icon: FileSpreadsheet, bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600' };
  }
  
  // Documents (Word, Google Docs)
  if (['doc', 'docx', 'txt', 'rtf', 'odt', 'pages'].includes(ext) || mimeType?.includes('document') || mimeType?.includes('word')) {
    return { icon: FileText, bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' };
  }
  
  // Presentations (PowerPoint, Keynote)
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext) || mimeType?.includes('presentation') || mimeType?.includes('powerpoint')) {
    return { icon: Presentation, bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600' };
  }
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'heic', 'heif'].includes(ext) || mimeType?.startsWith('image/')) {
    return { icon: Image, bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' };
  }
  
  // Videos
  if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'].includes(ext) || mimeType?.startsWith('video/')) {
    return { icon: Video, bgColor: 'bg-pink-100 dark:bg-pink-900/30', iconColor: 'text-pink-600' };
  }
  
  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext) || mimeType?.startsWith('audio/')) {
    return { icon: Music, bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600' };
  }
  
  // Archives
  if (['zip', 'rar', 'tar', 'gz', '7z', 'bz2'].includes(ext) || mimeType?.includes('zip') || mimeType?.includes('archive')) {
    return { icon: Archive, bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600' };
  }
  
  // Code files
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'json', 'xml', 'yaml', 'yml', 'sh', 'go', 'rs', 'php', 'rb', 'swift', 'kt'].includes(ext)) {
    return { icon: Code, bgColor: 'bg-gray-100 dark:bg-gray-700', iconColor: 'text-gray-600 dark:text-gray-300' };
  }
  
  // Default
  return { icon: File, bgColor: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-500' };
};

export function FileList({ 
  initialFolders = [], 
  initialFiles = [], 
  hasMoreFiles = false, 
  hasMoreFolders = false,
  currentPage = 1,
  searchQuery: initialSearchQuery
}: FileListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || "";
  
  const [folders, setFolders] = useState(initialFolders);
  const [files, setFiles] = useState(initialFiles);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(hasMoreFiles || hasMoreFolders);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Re-fetch when search params change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getDriveItemsAction(undefined, { 
        search: currentSearch || undefined, 
        page: 1, 
        limit: 20 
      });
      
      if (result.success) {
        setFolders(result.folders);
        setFiles(result.files);
        setPage(1);
        setHasMore(result.filesPagination?.hasMore || result.foldersPagination?.hasMore || false);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [currentSearch]);

  const items = [...folders, ...files];

  const formatSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return "—";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleItemClick = async (item: DriveItem) => {
    if (item.type === "folder") {
      router.push(`/drive/folders/${item.id}`);
    } else {
      // For public files, use public stream endpoint (no auth needed)
      // For private files, use authenticated Next.js API route
      if (item.isPublic) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        window.open(`${apiUrl}/api/files/public/${item.id}/stream`, '_blank');
      } else {
        window.open(`/api/files/${item.id}/stream`, '_blank');
      }
    }
  };

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await getDriveItemsAction(undefined, { 
        page: nextPage, 
        limit: 20,
        search: currentSearch || undefined 
      });
      
      if (result.success) {
        setFolders(prev => [...prev, ...result.folders]);
        setFiles(prev => [...prev, ...result.files]);
        setPage(nextPage);
        setHasMore(result.filesPagination?.hasMore || result.foldersPagination?.hasMore || false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="mt-8 flex-1 flex flex-col min-h-0">
        <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 px-4">Files</h2>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Loader2 size={32} className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-8 flex-1 flex flex-col min-h-0">
      <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 px-4">
        {currentSearch ? `Search results for "${currentSearch}"` : "Files"}
      </h2>
      
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="grid grid-cols-[3fr,1.5fr,1fr,1fr,auto] gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] sticky top-0 z-10">
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:block">Owner</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:block">Date modified</div>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:block text-right">File size</div>
           <div className="w-8"></div>
        </div>

        {/* File Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto">
           {items.map((item) => {
              const fileInfo = item.type === "folder" 
                ? { icon: Folder, bgColor: 'bg-gray-100 dark:bg-gray-800', iconColor: 'fill-gray-500 text-gray-500 dark:fill-gray-400 dark:text-gray-400' }
                : getFileIcon(item.name, item.mimeType);
              const IconComponent = fileInfo.icon;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleItemClick(item)}
                  className="group grid grid-cols-[3fr,1.5fr,1fr,1fr,auto] gap-4 px-4 py-3 hover:bg-blue-50 dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors items-center"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className={`w-8 h-8 flex-shrink-0 rounded flex items-center justify-center ${fileInfo.bgColor}`}>
                          <IconComponent size={16} className={fileInfo.iconColor} />
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate hidden md:block">
                       {format(new Date(item.updatedAt), "dd MMM yyyy")}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block truncate text-right">
                       {formatSize(item.size)}
                    </div>
                    
                    {/* Actions Column */}
                    <div 
                      className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                        {item.type === "folder" ? (
                          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                            <MoreVertical size={16} />
                          </button>
                        ) : (
                          <FileContextMenu file={{ id: item.id, name: item.name, isPublic: item.isPublic, isStarred: item.isStarred }} />
                        )}
                    </div>
                </div>
              );
           })}

           {/* Load More Button - Inside Scroll Container */}
           {hasMore && (
             <div className="p-4 flex justify-center">
               <button
                 onClick={loadMore}
                 disabled={isPending}
                 className="px-6 py-2 bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-sm font-medium transition-colors flex items-center gap-2"
               >
                 {isPending ? (
                   <>
                     <Loader2 size={16} className="animate-spin" />
                     Loading...
                   </>
                 ) : (
                   "Load More"
                 )}
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
