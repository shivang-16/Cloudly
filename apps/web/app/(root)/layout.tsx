import React from "react";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { UploadProvider } from "./_context/upload-context";
import { SidebarProvider } from "./_context/sidebar-context";
import { UploadPanel } from "./_components/upload-panel";
import { MobileFab } from "./_components/mobile-fab";
import { DragDropZone } from "./_components/drag-drop-zone";
import { apiGet } from "../../lib/api-client";

async function getStorageInfo() {
  try {
    const res = await apiGet('/api/files/storage');
    if (res.ok) {
      const data = await res.json();
      return { storageUsed: data.storageUsed || 0, storageLimit: data.storageLimit || 0 };
    }
  } catch (error) {
    console.error("Error fetching storage:", error);
  }
  return { storageUsed: 0, storageLimit: 20 * 1024 * 1024 * 1024 };
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storage = await getStorageInfo();

  return (
    <UploadProvider>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#18191a]">
          <Header />
          <div className="flex flex-1">
            <Sidebar storageUsed={storage.storageUsed} />
            <main className="flex-1 bg-white dark:bg-[#18191a] rounded-tl-2xl shadow-none border border-transparent dark:border-none p-2 pt-0">
              <DragDropZone>
                <div className="w-full bg-white dark:bg-[#131314] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-none min-h-[calc(100vh-6rem)]">
                  {children}
                </div>
              </DragDropZone>
            </main>
          </div>
        </div>
        <UploadPanel />
        <MobileFab />
      </SidebarProvider>
    </UploadProvider>
  );
}
