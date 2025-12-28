"use client";

import React from "react";
import { Trash2, RotateCcw, AlertTriangle, File, FileText, Image, Folder } from "lucide-react";
import { getTrashedFilesAction, restoreFileAction, deleteFileAction } from "../_actions/file.actions";
import { format } from "date-fns";
import { toast } from "sonner";

interface TrashedItem {
  id: string;
  name: string;
  type: string;
  mimeType?: string;
  size: number;
  updatedAt: string;
  trashedAt?: string;
}

function TrashedFileRow({ item, onRestore, onDelete }: { 
  item: TrashedItem; 
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
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

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</p>
          <p className="text-xs text-gray-500">
            {formatSize(item.size)} • Deleted {item.trashedAt ? format(new Date(item.trashedAt), "MMM d, yyyy") : "recently"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRestore(item.id)}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full text-blue-600"
          title="Restore"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-600"
          title="Delete permanently"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function BinPage() {
  const [trashedFiles, setTrashedFiles] = React.useState<TrashedItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadTrashedFiles();
  }, []);

  const loadTrashedFiles = async () => {
    setIsLoading(true);
    const result = await getTrashedFilesAction();
    if (result.success) {
      setTrashedFiles(result.files);
    }
    setIsLoading(false);
  };

  const handleRestore = async (id: string) => {
    const result = await restoreFileAction(id);
    if (result.success) {
      toast.success("File restored");
      setTrashedFiles(prev => prev.filter(f => f.id !== id));
    } else {
      toast.error(result.error || "Failed to restore file");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("This will permanently delete the file. This cannot be undone. Are you sure?")) return;
    
    const result = await deleteFileAction(id, true);
    if (result.success) {
      toast.success("File permanently deleted");
      setTrashedFiles(prev => prev.filter(f => f.id !== id));
    } else {
      toast.error(result.error || "Failed to delete file");
    }
  };

  const handleEmptyBin = async () => {
    if (!confirm(`This will permanently delete all ${trashedFiles.length} items. This cannot be undone. Are you sure?`)) return;
    
    for (const file of trashedFiles) {
      await deleteFileAction(file.id, true);
    }
    setTrashedFiles([]);
    toast.success("Bin emptied");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trash2 size={24} className="text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Bin</h1>
        </div>
        {trashedFiles.length > 0 && (
          <button
            onClick={handleEmptyBin}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <Trash2 size={16} />
            Empty bin
          </button>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Items in the bin will be automatically deleted after 30 days.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : trashedFiles.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Trash2 size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Bin is empty</h3>
            <p className="text-sm text-gray-500">Deleted files will appear here</p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#171717]">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {trashedFiles.length} item{trashedFiles.length !== 1 ? "s" : ""} in bin
              </span>
            </div>
            {trashedFiles.map((item) => (
              <TrashedFileRow 
                key={item.id} 
                item={item}
                onRestore={handleRestore}
                onDelete={handlePermanentDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
