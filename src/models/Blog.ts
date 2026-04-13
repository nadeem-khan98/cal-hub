import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  tags?: string[];
  faq?: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    focusKeyword: { type: String, default: "" },
    tags: { type: [String], default: [] },
    faq: [{ question: { type: String }, answer: { type: String } }],
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times in development
export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
