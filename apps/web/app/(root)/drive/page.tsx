
import { SuggestedFolders } from "./_components/suggested-folders";
import { FileList } from "./_components/file-list";
import { getDriveItemsAction } from "./_actions/drive.actions";

export default async function Home() {
  const { folders, files, success } = await getDriveItemsAction();

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl text-gray-700 dark:text-gray-200 mb-2 px-1">Welcome to Drive</h1>
      
      <SuggestedFolders folders={(folders || []).map(f => ({ id: f.id, name: f.name }))} />
      
      <FileList initialFolders={folders || []} initialFiles={files || []} />
    </div>
  );
}
