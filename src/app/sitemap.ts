import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    await connectDB();

    // Fetch all dynamic content slugs
    const [categories, tools, blogs] = await Promise.all([
      Category.find({}).select("slug updated").lean(),
      Tool.find({}).select("slug updated").lean(),
      Blog.find({}).select("slug updated").lean(),
    ]);

    // Root-level pages
    const staticPages: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    // Dynamic Category Pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/tools/category/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Dynamic Tool Pages
    const toolPages: MetadataRoute.Sitemap = tools.map((tool: any) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Dynamic Blog Pages
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Fallback to minimal sitemap on error
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}

