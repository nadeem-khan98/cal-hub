"use client";

import { useEffect, useState } from "react";
import { FileText, Wrench, MessageSquare, MailOpen, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Stats {
  blogs: number;
  tools: number;
  messages: number;
  unreadMessages: number;
}

function StatCard({ label, value, icon: Icon, color, href }: { label: string; value: number; icon: any; color: string; href?: string }) {
  const content = (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group transition-all hover:shadow-md ${href ? 'cursor-pointer' : ''}`}>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => { if (data.success) setStats(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
          color={`${stats.unreadMessages > 0 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
          href="/admin/messages"
        />
      </div>

      {/* Unread alert banner */}
      {stats.unreadMessages > 0 && (
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 animate-pulse" />
            <p className="font-semibold text-orange-800 dark:text-orange-200 text-sm">
              You have <strong>{stats.unreadMessages}</strong> unread message{stats.unreadMessages > 1 ? 's' : ''}.
            </p>
          </div>
          <Link href="/admin/messages" className="text-sm font-bold text-orange-700 dark:text-orange-300 hover:underline flex items-center">
            View Inbox <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-blue-500" /> Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
