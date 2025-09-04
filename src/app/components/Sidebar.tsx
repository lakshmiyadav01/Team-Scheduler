// src/app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
   { name: "Shifts", href: "/shifts", icon: Calendar },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 }, 
  { name: "Settings", href: "/settings", icon: Settings },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-58 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      <div className="p-4 text-xl font-bold">
        <Link href="/">Company</Link></div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer */}
      <div className="p-4 text-xs text-gray-500 dark:text-gray-400 ">
        © 2025 Company
      </div>
    </aside>
  );
}


