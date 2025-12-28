import React, { useState, useEffect } from "react";
import { createFolderAction } from "../drive/_actions/drive.actions";
import { toast } from "sonner"; // Assuming sonner is installed, if not will replace with console or standard alert for now

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => Promise<any>;
}

export function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("Untitled folder");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFolderName("Untitled folder");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl w-[320px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-[22px] font-normal text-[#202124] dark:text-[#e3e3e3] mb-4">New folder</h3>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-3 py-2 text-[16px] text-[#202124] dark:text-[#e3e3e3] border border-[#1a73e8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1a73e8] bg-white dark:bg-[#1e1e1e]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCreate(folderName);
                onClose();
              }
            }}
          />
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 text-[14px] font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#f5f8fd] dark:hover:bg-[#303134] rounded-[4px] transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={async () => {
                if (!folderName.trim()) return;
                setIsLoading(true);
                const res = await onCreate(folderName);
                setIsLoading(false);
                if (res?.success) onClose();
              }}
              className="px-6 py-2 text-[14px] font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#f5f8fd] dark:hover:bg-[#303134] rounded-[4px] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
