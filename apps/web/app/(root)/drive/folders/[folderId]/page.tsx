import { FileList } from "../../_components/file-list";
import { getDriveItemsAction } from "../../_actions/drive.actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const { folders, files } = await getDriveItemsAction(folderId);

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Link 
          href="/drive" 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to My Drive</span>
        </Link>
      </div>

      <h1 className="text-2xl text-gray-700 dark:text-gray-200 mb-6 px-1">Folder Contents</h1>
      
      <FileList initialFolders={folders || []} initialFiles={files || []} />
    </div>
  );
}
