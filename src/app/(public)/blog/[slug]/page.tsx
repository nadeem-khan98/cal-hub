import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Tool from "@/models/Tool";
import Link from "next/link";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";
import ToolCTA from "@/components/ToolCTA";
import PopularTools from "@/components/PopularTools";
import React from "react";

export const revalidate = 3600;

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
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription,
      type: "article",
    }
  };
}

// Helper to add internal links aggressively
function autoLinkContent(content: string, allTools: any[]) {
  let modifiedContent = content;
  allTools.forEach(tool => {
    // Basic exact word match avoiding inside brackets
    const keyword = tool.name.split(" ")[0]; 
    if (keyword.length < 3) return;
    
    // Simplistic text replacement (max 2)
    let count = 0;
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    modifiedContent = modifiedContent.replace(regex, (match, p1, offset, string) => {
      // Very naive check to not break markdown links or tags
      const openBracket = string.lastIndexOf('[', offset);
      const closeBracket = string.lastIndexOf(']', offset);
      if (openBracket > -1 && closeBracket < openBracket) return match; 
      
      const openTag = string.lastIndexOf('<', offset);
      const closeTag = string.lastIndexOf('>', offset);
      if (openTag > -1 && closeTag < openTag) return match;

      if (count >= 2) return match;
      count++;
      return `[${match}](/tools/${tool.slug})`;
    });
  });
  return modifiedContent;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  
  const [blog, allTools] = await Promise.all([
    Blog.findOne({ slug }).lean(),
    Tool.find({}).lean()
  ]);

  if (!blog) {
    notFound();
  }

  // Generate JSON-LD with embedded FAQ Schema if exists
  const jsonLd: any = {
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

  if (blog.faq && blog.faq.length > 0) {
    jsonLd.mainEntity = blog.faq.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }));
  }

  // Parse content for [[TOOL:slug]], inject AdSlot after 2 paragraphs, auto-link
  const autoLinkedContent = autoLinkContent(blog.content, allTools);
  const blocks = autoLinkedContent.split(/(?:\[\[TOOL:[a-z0-9-]+\]\])/g);
  const toolMatches = Array.from(autoLinkedContent.matchAll(/\[\[TOOL:([a-z0-9-]+)\]\]/g));

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors">
      <article className="max-w-3xl mx-auto py-12 px-4 shadow-sm min-h-screen">
        <JsonLd data={jsonLd} />

        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-10 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Articles
        </Link>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        <header className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm font-medium">
            <span>Published {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              {Math.ceil(blog.content.length / 1000)} min read
            </span>
          </div>
        </header>

        <AdSlot position="Top of Article" />

        <div className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 my-10">
          {blocks.map((block, index) => {
             // Split the block to inject AdSlot after first 2 paragraphs of the first block
             let renderBlock = <ReactMarkdown key={`md-${index}`}>{block}</ReactMarkdown>;
             if (index === 0) {
               const paragraphs = block.split('\n\n');
               if (paragraphs.length > 2) {
                 const firstPart = paragraphs.slice(0, 2).join('\n\n');
                 const secondPart = paragraphs.slice(2).join('\n\n');
                 renderBlock = (
                   <React.Fragment key={`md-${index}`}>
                     <ReactMarkdown>{firstPart}</ReactMarkdown>
                     <AdSlot position="Middle Setup" />
                     <ReactMarkdown>{secondPart}</ReactMarkdown>
                   </React.Fragment>
                 );
               }
             }

             if (index < toolMatches.length) {
               const slug = toolMatches[index][1];
               return (
                 <React.Fragment key={`frag-${index}`}>
                   {renderBlock}
                   {/* @ts-expect-error Async Server Component */}
                   <ToolCTA slug={slug} />
                 </React.Fragment>
               );
             }
             return renderBlock;
          })}
        </div>

        {blog.faq && blog.faq.length > 0 && (
          <section className="my-16 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <HelpCircle className="mr-3 text-blue-500" /> Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {blog.faq.map((f: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{f.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <AdSlot position="End of Article" />

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6 bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div>
            <h3 className="text-xl text-gray-900 dark:text-gray-100 font-bold mb-1">Ready to crunch some numbers?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Explore our free tools crafted for speed and precision.</p>
          </div>
          <Link href="/tools" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center shrink-0">
            Explore Calculators <ArrowRight size={16} className="ml-2 inline-block" />
          </Link>
        </div>

        {/* Dynamic Popular Tools Section */}
        {/* @ts-expect-error Async Server Component */}
        <PopularTools limit={3} />

      </article>
    </div>
  );
}
