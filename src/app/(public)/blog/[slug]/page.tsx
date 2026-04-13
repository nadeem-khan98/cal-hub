import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Tool from "@/models/Tool";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${blog.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.metaDescription,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "CalcHub",
    }
  };

  // Find related tools based on keywords in content
  const allTools = await Tool.find({}).lean();
  const contentLower = blog.content.toLowerCase();
  
  const relatedTools = allTools.filter((tool: any) => {
    // E.g., if tool name is "BMI Calculator", check if "bmi" is in content
    const firstWord = tool.name.split(" ")[0].toLowerCase();
    return contentLower.includes(firstWord);
  });

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors">
      <article className="max-w-3xl mx-auto py-12 px-4">
        <JsonLd data={jsonLd} />

        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-10 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Articles
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            <span>Published {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>
        </header>

        <AdSlot position="Top of Article" />

        <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 my-10">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {relatedTools.length > 0 && (
          <div className="my-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
            <h3 className="flex items-center text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">
              <Lightbulb className="mr-2 text-blue-500" size={20} /> Try these related tools:
            </h3>
            <div className="flex flex-col gap-3">
              {relatedTools.map((tool: any) => (
                <Link key={tool._id.toString()} href={`/tools/${tool.slug}`} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all border border-blue-100 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</span>
                  <span className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
                    Use Tool <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdSlot position="End of Article" />

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Ready to crunch some numbers?</p>
          <Link href="/tools" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            Explore All Calculators
          </Link>
        </div>
      </article>
    </div>
  );
}
