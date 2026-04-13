"use client";

import { useEffect, useState } from "react";
import {
  FileText, Wrench, MessageSquare, MailOpen,
  TrendingUp, ArrowRight, Tag, ChevronRight, Calculator,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  blogs: number;
  tools: number;
  messages: number;
  unreadMessages: number;
}

interface CategoryStat {
  _id: string;
  name: string;
  slug: string;
  toolCount: number;
  tools: { name: string; slug: string }[];
}

function StatCard({
  label, value, icon: Icon, color, href,
}: {
  label: string; value: number; icon: any; color: string; href?: string;
}) {
  const content = (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group transition-all hover:shadow-md ${href ? "cursor-pointer" : ""}`}>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={26} />
      </div>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, tools: 0, messages: 0, unreadMessages: 0 });
  const [catStats, setCatStats] = useState<CategoryStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => { if (data.success) setStats(data.data); })
      .catch(console.error)
      .finally(() => setLoadingStats(false));

    fetch("/api/admin/categories/stats")
      .then((res) => res.json())
      .then((data) => { if (data.success) setCatStats(data.data); })
      .catch(console.error)
      .finally(() => setLoadingCats(false));
  }, []);

  if (loadingStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-32 border border-gray-100 dark:border-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin. Here's your platform at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Blogs" value={stats.blogs} icon={FileText} color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" href="/admin/blogs" />
        <StatCard label="Total Tools" value={stats.tools} icon={Wrench} color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" href="/admin/tools" />
        <StatCard label="Total Messages" value={stats.messages} icon={MessageSquare} color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" href="/admin/messages" />
        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={MailOpen}
          color={`${stats.unreadMessages > 0 ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
          href="/admin/messages"
        />
      </div>

      {/* Unread alert banner */}
      {stats.unreadMessages > 0 && (
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 animate-pulse" />
            <p className="font-semibold text-orange-800 dark:text-orange-200 text-sm">
              You have <strong>{stats.unreadMessages}</strong> unread message{stats.unreadMessages > 1 ? "s" : ""}.
            </p>
          </div>
          <Link href="/admin/messages" className="text-sm font-bold text-orange-700 dark:text-orange-300 hover:underline flex items-center">
            View Inbox <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      )}

      {/* Category Breakdown */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <Tag size={20} className="mr-2 text-blue-500" /> Tools by Category
        </h2>
        {loadingCats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-24 border border-gray-100 dark:border-gray-700" />
            ))}
          </div>
        ) : catStats.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
            <Tag size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No categories yet.</p>
            <Link href="/admin/categories" className="text-sm font-semibold text-blue-500 hover:underline mt-1 inline-block">
              Create your first category →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catStats.map((cat) => (
              <div key={cat._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedCat(expandedCat === cat._id ? null : cat._id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calculator size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{cat.name}</p>
                      <p className="text-xs text-gray-400">{cat.toolCount} tool{cat.toolCount !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {cat.toolCount}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-gray-400 transition-transform ${expandedCat === cat._id ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>
                {expandedCat === cat._id && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    {cat.tools.length === 0 ? (
                      <p className="px-5 py-3 text-sm text-gray-400 italic">No tools assigned.</p>
                    ) : (
                      cat.tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Calculator size={13} className="text-blue-400 flex-shrink-0" />
                          {tool.name}
                        </Link>
                      ))
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-2">
                      <Link
                        href={`/tools/category/${cat.slug}`}
                        target="_blank"
                        className="text-xs text-blue-500 hover:underline font-medium"
                      >
                        View public page →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-blue-500" /> Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/admin/blogs" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all group block">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Manage Blogs</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create & edit SEO-optimized blog posts.</p>
          </Link>

          <Link href="/admin/tools" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-green-200 dark:hover:border-green-700 transition-all group block">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Wrench size={20} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Manage Tools</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure calculator tools and meta info.</p>
          </Link>

          <Link href="/admin/categories" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group block">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Tag size={20} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Categories</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add, manage & track tool categories.</p>
          </Link>

          <Link href="/admin/messages" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all group block">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Message Inbox</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and manage contact form submissions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
