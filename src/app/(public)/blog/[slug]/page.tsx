import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JsonLd from "@/components/JsonLd";

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

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 bg-white">
      <JsonLd data={jsonLd} />

      <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-10 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Articles
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          {blog.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <span>Published {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
        </div>
      </header>

      <div className="prose prose-lg prose-blue max-w-none text-gray-700">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 font-medium">Ready to crunch some numbers?</p>
        <Link href="/tools" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
          Explore All Calculators
        </Link>
      </div>
    </article>
  );
}
