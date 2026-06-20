import Link from "next/link";
import { Metadata } from "next";
import { FileText } from "lucide-react";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export const metadata: Metadata = {
  title: "Blog - CalcHub",
  description: "Read our latest articles, guides, and tips.",
};

export const revalidate = 3600;

export default async function BlogIndex() {
  await connectDB();
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Latest Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Insights, guides, and tutorials to help you calculate smarter.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="py-20">
          <p className="text-gray-500">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: any) => (
            <Link 
              key={blog._id.toString()} 
              href={`/blog/${blog.slug}`}
              className="group flex flex-col h-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-gray-50 dark:bg-gray-900 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 relative">
                <FileText size={48} className="text-gray-300 dark:text-gray-700" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
                  Guide
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm line-clamp-2 mb-6">
                  {blog.metaDescription}
                </p>
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-auto">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
