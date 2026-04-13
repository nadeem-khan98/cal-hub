import Link from "next/link";
import { ArrowRight, Calculator, FileText, CheckCircle2, Zap, Shield, Smartphone } from "lucide-react";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";
import AdSlot from "@/components/AdSlot";

export const revalidate = 3600;

export default async function HomePage() {
  await connectDB();
  
  const [tools, blogs] = await Promise.all([
    Tool.find({}).sort({ createdAt: -1 }).limit(6).lean(),
    Blog.find({}).sort({ createdAt: -1 }).limit(3).lean()
  ]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      {/* Hero Section */}
      <section className="text-center pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/30">
          <span className="flex items-center tracking-wide">
            <CheckCircle2 size={16} className="mr-2" /> 100% Free • No Signup • Fast Results
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
          Tools designed to make your life <span className="text-blue-600 dark:text-blue-500 relative inline-block">simpler.<svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 dark:text-blue-900/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none"/></svg></span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
          Whether you need to calculate your BMI, verify loan interest, or just figure out a dinner tip, our fast and free tools have you covered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/tools" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Explore Tools <ArrowRight size={18} className="ml-2" />
          </Link>
          <Link 
            href="/blog" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
          >
            Read Blog
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <AdSlot position="Home Top" />
      </div>

      {/* Tools Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Popular Tools</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Instant answers to everyday problems.</p>
          </div>
          <Link href="/tools" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-1 group">
            View All Calculators <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tools available yet. Try seeding the database!</p>
          ) : (
            tools.map((tool: any) => (
              <Link 
                key={tool._id.toString()} 
                href={`/tools/${tool.slug}`}
                className="group p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 dark:from-blue-900/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-bl-3xl"></div>
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Calculator size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{tool.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1 leading-relaxed text-balance">
                  {tool.description}
                </p>
                <div className="mt-auto inline-flex items-center justify-center w-full py-3 bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 rounded-xl transition-colors">
                  Use Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Why Use Our Tools Section */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20 border-y border-gray-100 dark:border-gray-800 my-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Why Use Our Tools?</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">Built with precision and speed in mind to provide the best user experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Instant calculations as you type. No waiting.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Accurate</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tested formulas to guarantee the right results.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Completely Free</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No paywalls, no hidden fees, and no signups.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Mobile Friendly</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Works perfectly on your phone and tablet.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mb-16">
        <AdSlot position="Home Middle" />
      </div>

      {/* Blogs Section */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Latest from the Blog</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Actionable insights and guides.</p>
          </div>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-1 group">
            Read All Articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No blog posts available yet. Try seeding the database!</p>
          ) : (
            blogs.map((blog: any) => (
              <Link 
                key={blog._id.toString()} 
                href={`/blog/${blog.slug}`}
                className="group flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-gray-100 dark:bg-gray-900 aspect-[16/10] flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-gray-700 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FileText size={48} className="text-gray-300 dark:text-gray-600 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
                    Guide
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm line-clamp-2 mb-6">
                    {blog.metaDescription}
                  </p>
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-auto flex items-center gap-1">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
