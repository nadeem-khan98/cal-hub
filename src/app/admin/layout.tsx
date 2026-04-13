"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Wrench, LogOut, Mail, Tag } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState, useCallback } from "react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Tools", href: "/admin/tools", icon: Wrench },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // All hooks MUST be called before any conditional return
  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success) setUnreadCount(data.unreadCount || 0);
    } catch {
      /* silently fail — don't break layout */
    }
  }, []);

  useEffect(() => {
    // Only fetch when NOT on the login page
    if (pathname === "/admin/login") return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, [pathname, fetchUnread]);

  // Conditional render AFTER all hooks
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
            CalcHub Admin
          </h1>
          <ThemeToggle />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const badge = link.name === "Messages" && unreadCount > 0 ? unreadCount : null;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{link.name}</span>
                </div>
                {badge && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
