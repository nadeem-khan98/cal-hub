"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "" });
      setShowForm(false);
      setEditingId(null);
      fetchBlogs();
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
    });
    setEditingId(blog._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Blogs</h1>
        <button
          onClick={() => {
            setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "" });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span>{showForm ? "Cancel" : "Add New Blog"}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{editingId ? "Edit Blog" : "Create Blog"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Slug</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Content (Markdown)</label>
              <textarea
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Meta Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Meta Description</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                {editingId ? "Update Blog" : "Save Blog"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Title</th>
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Slug</th>
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">No blogs found.</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-4 text-gray-900 dark:text-gray-100">{blog.title}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{blog.slug}</td>
                    <td className="p-4 flex space-x-3">
                      <button onClick={() => handleEdit(blog)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
