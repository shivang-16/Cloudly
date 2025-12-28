"use client";

import React from "react";
import {
  Plus,
  Home,
  HardDrive,
  Monitor,
  Users,
  Clock,
  Star,
  AlertCircle,
  Trash2,
  Cloud,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "Home", icon: Home, href: "/drive" },
  { name: "My Drive", icon: HardDrive, href: "/drive/my-drive" },
  { name: "Computers", icon: Monitor, href: "/drive/computers" },
];

const sharedItems = [
  { name: "Shared with me", icon: Users, href: "/drive/shared-with-me" },
  { name: "Recent", icon: Clock, href: "/drive/recent" },
  { name: "Starred", icon: Star, href: "/drive/starred" },
];

const otherItems = [
  { name: "Spam", icon: AlertCircle, href: "/drive/spam" },
  { name: "Bin", icon: Trash2, href: "/drive/bin" },
  { name: "Storage", icon: Cloud, href: "/drive/storage" },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ name, icon: Icon, href }: { name: string; icon: any; href: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-3 px-4 py-1.5 rounded-r-full text-sm font-medium transition-colors mb-0.5 mr-4",
          isActive
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <Icon size={18} className={clsx(isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400")} />
        {name}
      </Link>
    );
  };

  return (
    <aside className="w-64 flex flex-col pt-2 pb-4 h-full overflow-y-auto">
      <div className="pl-3 mb-6">
        <button className="flex items-center gap-3 bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] shadow-md dark:shadow-none dark:border-gray-600 border border-transparent dark:border rounded-2xl px-4 py-4 transition-all active:shadow-sm">
          <Plus size={24} className="text-gray-600 dark:text-gray-200" />
          <span className="font-medium text-gray-700 dark:text-gray-200">New</span>
        </button>
      </div>

      <nav className="flex-1">
        <div className="mb-2">
            {navItems.map((item) => (
            <NavItem key={item.name} {...item} />
            ))}
        </div>
        
        <div className="mb-2 pt-2">
            {sharedItems.map((item) => (
            <NavItem key={item.name} {...item} />
            ))}
        </div>

        <div className="mb-2 pt-2">
            {otherItems.map((item) => (
            <NavItem key={item.name} {...item} />
            ))}
        </div>
      </nav>

      <div className="px-6 mt-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          13.14 GB of 2 TB used
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-4 overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: '1%' }}></div>
        </div>
        <button className="text-blue-600 dark:text-blue-300 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 w-fit">
          Get more storage
        </button>
      </div>
    </aside>
  );
}
