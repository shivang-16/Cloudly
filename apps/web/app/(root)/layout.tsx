import React from "react";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { UploadProvider } from "./_context/upload-context";
import { UploadPanel } from "./_components/upload-panel";
import { DragDropZone } from "./_components/drag-drop-zone";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UploadProvider>
      <div className="flex flex-col h-screen bg-white dark:bg-[#18191a]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 bg-white dark:bg-[#18191a] rounded-tl-2xl overflow-hidden shadow-none border border-transparent dark:border-none p-2 pt-0">
            <DragDropZone>
              <div className="h-full w-full bg-white dark:bg-[#131314] rounded-2xl overflow-y-auto p-4 shadow-sm border border-gray-100 dark:border-none">
                {children}
              </div>
            </DragDropZone>
          </main>
        </div>
      </div>
      <UploadPanel />
    </UploadProvider>
  );
}

