import { Suspense } from "react";
import { SuggestedFolders } from "./_components/suggested-folders";
import { FileList } from "./_components/file-list";
import { getDriveItemsAction } from "./_actions/drive.actions";
import { Loader2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

function FileListLoading() {
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

export default async function DrivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const page = parseInt(params.page || "1", 10);
  
  const result = await getDriveItemsAction(undefined, { 
    search, 
    page, 
    limit: 20 
  });

  const isSearching = !!search;

  return (
    <div className="flex flex-col h-full">
      {!isSearching && (
        <>
          <h1 className="text-2xl text-gray-700 dark:text-gray-200 mb-2 px-1">Welcome to Cloudly</h1>
          <SuggestedFolders folders={(result.folders || []).map(f => ({ id: f.id, name: f.name }))} />
        </>
      )}
      
      <Suspense fallback={<FileListLoading />}>
        <FileList 
          initialFolders={result.folders || []} 
          initialFiles={result.files || []}
          hasMoreFiles={result.filesPagination?.hasMore}
          hasMoreFolders={result.foldersPagination?.hasMore}
          currentPage={page}
          searchQuery={search}
        />
      </Suspense>
    </div>
  );
}
