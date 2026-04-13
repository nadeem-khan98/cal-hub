"use client";

import { useEffect, useState } from "react";
import { FileText, Wrench } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ blogs: 0, tools: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [blogsRes, toolsRes] = await Promise.all([
          fetch("/api/admin/blogs").then((res) => res.json()),
          fetch("/api/admin/tools").then((res) => res.json()),
        ]);

        setStats({
          blogs: blogsRes.data?.length || 0,
          tools: toolsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Blogs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.blogs}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Tools</p>
            <p className="text-3xl font-bold text-gray-900">{stats.tools}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Wrench size={24} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/blogs"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer block"
        >
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 mb-2">Manage Blogs &rarr;</h2>
          <p className="text-sm text-gray-500">Create, edit, or delete SEO blog posts.</p>
        </Link>

        <Link 
          href="/admin/tools"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer block"
        >
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 mb-2">Manage Tools &rarr;</h2>
          <p className="text-sm text-gray-500">Configure calculator tools and their schemas.</p>
        </Link>
      </div>
    </div>
  );
}
