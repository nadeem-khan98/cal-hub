import Link from "next/link";
import { ArrowRight, Calculator, FileText } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";

export const revalidate = 3600;

export default async function HomePage() {
  await connectDB();
  
  const [tools, blogs] = await Promise.all([
    Tool.find({}).sort({ createdAt: -1 }).limit(6).lean(),
    Blog.find({}).sort({ createdAt: -1 }).limit(3).lean()
  ]);

  return (
    <div className="space-y-24 bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Tools designed to make your life <span className="text-blue-600">simpler.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
          Whether you need to calculate your BMI, verify loan interest, or just figure out a dinner tip, our fast and free tools have you covered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/tools" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition"
          >
            Explore Tools
          </Link>
          <Link 
            href="/blog" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Read Blog
          </Link>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Tools</h2>
            <p className="text-gray-500 mt-2">Instant answers to everyday problems.</p>
          </div>
          <Link href="/tools" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group">
            View All Calculator Tools <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.length === 0 ? (
            <p className="text-gray-500">No tools available yet. Try seeding the database!</p>
          ) : (
            tools.map((tool: any) => (
              <Link 
                key={tool._id.toString()} 
                href={`/tools/${tool.slug}`}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Calculator size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed text-balance">
                  {tool.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 text-sm font-semibold text-blue-600 flex items-center">
                  Use Tool <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Blogs Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest from the Blog</h2>
            <p className="text-gray-500 mt-2">Actionable insights and guides.</p>
          </div>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group">
            Read All Articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.length === 0 ? (
            <p className="text-gray-500">No blog posts available yet. Try seeding the database!</p>
          ) : (
            blogs.map((blog: any) => (
              <Link 
                key={blog._id.toString()} 
                href={`/blog/${blog.slug}`}
                className="group flex flex-col h-full"
              >
                <div className="bg-gray-100 rounded-2xl aspect-video mb-5 flex items-center justify-center overflow-hidden border border-gray-200">
                  <FileText size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {blog.metaDescription}
                </p>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-auto">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
