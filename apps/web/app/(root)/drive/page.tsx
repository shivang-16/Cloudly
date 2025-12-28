
import { SuggestedFolders } from "./_components/suggested-folders";
import { FileList } from "./_components/file-list";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl text-gray-700 dark:text-gray-200 mb-6 px-1">Welcome to Drive</h1>
      
      <SuggestedFolders />
      
      <FileList />
    </div>
  );
}
