import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const tools = await Tool.find({}).lean();
  const blogs = await Blog.find({}).lean();

  const toolUrls = tools.map((tool: any) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updatedAt || tool.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogUrls = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...toolUrls,
    ...blogUrls,
  ];
}
