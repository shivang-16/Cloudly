"use client";

import React from "react";
import { Star, File, FileText, Image, Folder } from "lucide-react";
import { getStarredFilesAction } from "../_actions/starred.actions";
import { format } from "date-fns";
import { FileContextMenu } from "../_components/file-context-menu";

interface StarredItem {
  id: string;
  name: string;
  type: string;
  mimeType?: string;
  size: number;
  updatedAt: string;
  isPublic?: boolean;
}

function StarredFileRow({ item }: { item: StarredItem }) {
  const getIcon = () => {
    if (item.type === "folder") return <Folder size={16} className="text-gray-500" />;
    if (item.mimeType?.startsWith("image/")) return <Image size={16} className="text-blue-500" />;
    if (item.mimeType?.includes("pdf")) return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleOpen = () => {
    if (item.isPublic) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001';
      window.open(`${apiUrl}/api/files/public/${item.id}/stream`, '_blank');
    } else {
      window.open(`/api/files/${item.id}/stream`, '_blank');
    }
  };

  return (
    <div 
      onClick={handleOpen}
      className="group flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] border-b border-gray-100 dark:border-gray-700 cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</p>
          <p className="text-xs text-gray-500">
            {formatSize(item.size)} • {format(new Date(item.updatedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <FileContextMenu file={{ id: item.id, name: item.name, isPublic: item.isPublic }} />
      </div>
    </div>
  );
}

export default function StarredPage() {
  const [starredFiles, setStarredFiles] = React.useState<StarredItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadStarredFiles();
  }, []);

  const loadStarredFiles = async () => {
    setIsLoading(true);
    const result = await getStarredFilesAction();
    if (result.success) {
      setStarredFiles(result.files);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="text-yellow-500 fill-yellow-500" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Starred</h1>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : starredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Star size={28} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No starred files</h3>
            <p className="text-sm text-gray-500">Star files to find them quickly here</p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#171717]">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {starredFiles.length} starred item{starredFiles.length !== 1 ? "s" : ""}
              </span>
            </div>
            {starredFiles.map((item) => (
              <StarredFileRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
