"use client";

import React from "react";
import { FileText, FileSpreadsheet, File, Video, MoreVertical, TableProperties, LayoutGrid, Check } from "lucide-react";

const files = [
  {
    id: 1,
    name: "My_Resume.pdf",
    type: "pdf",
    details: "You opened • 23 Dec",
    owner: "me",
    ownerImg: "me",
    location: "My Drive",
  },
  {
    id: 2,
    name: "Startups Founders",
    type: "sheet",
    details: "Xpay needs follow-up after initial email sent on Dec 7; check contact details.", // Simplified
    owner: "shivang.beetle...",
    ownerImg: "SB",
    location: "Shared with me",
  },
  {
    id: 3,
    name: "Experience Certificate",
    type: "doc",
    details: "Certifies Akshata Solapurkar's valuable work as a Frontend Developer Intern...",
    owner: "Ramesh Cha...",
    ownerImg: "RC",
    location: "Shared with me",
  },
  {
    id: 4,
    name: "Research Document for Beetle Startup",
    type: "doc",
    details: "You opened • 19 Dec",
    owner: "me",
    ownerImg: "me",
    location: "My Drive",
  },
  {
    id: 5,
    name: "experience_certificate.pdf",
    type: "pdf",
    details: "You modified • 7 Dec",
    owner: "me",
    ownerImg: "me",
    location: "My Drive",
  },
   {
    id: 6,
    name: "Introduction Video Scripting",
    type: "doc",
    details: "Beetle AI offers system-level code review; pricing is 3 months free...",
    owner: "solapurkarak...",
    ownerImg: "SA",
    location: "Shared with me",
  },
   {
    id: 7,
    name: "2022UIC3509_TRANING_REPORT",
    type: "doc",
    details: "You edited • 8 Dec",
    owner: "shivang.beetle...",
    ownerImg: "SB",
    location: "Shared with me",
  },
];

const FileIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "pdf":
            return <FileText className="text-red-500" size={20} />;
        case "sheet":
            return <FileSpreadsheet className="text-green-500" size={20} />;
        case "doc":
             return <FileText className="text-blue-500" size={20} />;
        case "video":
            return <Video className="text-red-500" size={20} />;
        default:
             return <File className="text-gray-500" size={20} />;
    }
}

export function FileList() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2 mt-4 px-2">
         <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggested files</h2>
         <div className="flex border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
             <button className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-r border-gray-300 dark:border-gray-600">
                <Check size={16} className="mr-2" />
                <TableProperties size={18} />
             </button>
             <button className="flex items-center px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                <LayoutGrid size={18} />
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-separate border-spacing-y-0 text-sm">
          <thead className="sticky top-0 bg-white dark:bg-[#18191a] z-10 text-gray-500 dark:text-gray-400 font-medium">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="font-medium py-3 px-4 w-[40%]">Name</th>
              <th className="font-medium py-3 px-4 w-[30%]">Details</th>
              <th className="font-medium py-3 px-4 w-[15%]">Owner</th>
              <th className="font-medium py-3 px-4 w-[15%]">Location</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="">
            {files.map((file) => (
              <tr
                key={file.id}
                className="group hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <td className="py-2.5 px-4 pr-10">
                  <div className="flex items-center gap-3">
                    <FileIcon type={file.type} />
                    <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
                      {file.name}
                    </span>
                  </div>
                </td>
                 <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 truncate max-w-xs">
                     <span className="block truncate">{file.details}</span>
                 </td>
                 <td className="py-2.5 px-4">
                     <div className="flex items-center gap-2">
                        {file.owner === 'me' ? (
                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">Me</div>
                        ) : (
                             <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">{file.ownerImg}</div>
                        )}
                        <span className="text-gray-500 dark:text-gray-400 truncate max-w-[80px]">{file.owner}</span>
                     </div>
                 </td>
                 <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">
                     {file.location}
                 </td>
                 <td className="py-2.5 px-2 text-right">
                     <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded-full transition-all text-gray-500 dark:text-gray-400">
                         <MoreVertical size={18} />
                     </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
