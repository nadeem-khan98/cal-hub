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
    <div className="max-w-6xl mx-auto px-4 py-16 bg-white text-gray-800">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Latest Articles
        </h1>
        <p className="text-lg text-gray-500">
          Insights, guides, and tutorials to help you calculate smarter.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="py-20 text-gray-500">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <Link 
              key={blog._id.toString()} 
              href={`/blog/${blog.slug}`}
              className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 bg-gray-50 relative flex items-center justify-center border-b border-gray-100">
                <FileText size={48} className="text-gray-300 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {blog.metaDescription}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition">Read Article &rarr;</span>
                  <span className="text-xs font-medium text-gray-400 tracking-wider">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
