"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp, Calculator, Tag } from "lucide-react";

interface Tool {
  name: string;
  slug: string;
}

interface CategoryStat {
  _id: string;
  name: string;
  slug: string;
  description: string;
  toolCount: number;
  tools: Tool[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminCategories() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, catRes] = await Promise.all([
        fetch("/api/admin/categories/stats"),
        fetch("/api/admin/categories"),
      ]);
      const [statsData, catData] = await Promise.all([statsRes.json(), catRes.json()]);
      if (statsData.success) setStats(statsData.data);
      if (catData.success) setCategories(catData.data);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: slugify(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create category.");
      } else {
        setFormData({ name: "", slug: "", description: "" });
        setShowForm(false);
        fetchData();
      }
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Tools in this category won't be deleted.`)) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchData();
    } catch {
      setError("Failed to delete.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage tool categories — changes reflect instantly across the site.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "New Category"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">
            Create Category
          </h2>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Finance"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Slug (auto-generated) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. finance"
                  className={inputClass}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Used in URLs: /tools/category/{formData.slug || "slug"}</p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description (optional)</label>
              <textarea
                rows={2}
                placeholder="Briefly describe this category…"
                className={inputClass}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
              >
                {submitting ? "Creating…" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-28 border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Tag size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-lg">No categories yet</p>
          <p className="text-sm mt-1">Create your first category to get started.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}
                className="text-left bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calculator size={20} />
                  </div>
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-blue-600 text-white text-xs font-bold rounded-full">
                    {cat.toolCount}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">/tools/category/{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{cat.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-blue-500 mt-3 font-medium">
                  {expanded === cat._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expanded === cat._id ? "Hide tools" : `View ${cat.toolCount} tool${cat.toolCount !== 1 ? "s" : ""}`}
                </div>
              </button>
            ))}
          </div>

          {/* Expanded Tool List */}
          {expanded && (() => {
            const cat = stats.find((c) => c._id === expanded);
            if (!cat) return null;
            return (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-blue-200 dark:border-blue-700 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {cat.name} <span className="text-blue-500 font-normal text-sm">({cat.toolCount} tools)</span>
                  </h3>
                </div>
                {cat.tools.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No tools assigned to this category yet.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {cat.tools.map((tool) => (
                      <div key={tool.slug} className="px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calculator size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tool.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{tool.slug}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Full Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">All Categories</h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tools</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((cat) => (
                  <tr key={cat._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-gray-900 dark:text-gray-100">{cat.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{cat.slug}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                        {cat.toolCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors p-1 rounded"
                        aria-label="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
