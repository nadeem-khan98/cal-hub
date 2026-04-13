import mongoose, { Schema, Document } from "mongoose";

// A dynamic generic schema for tools.
// Complex formula logic will be mapped via a static slug using predefined functions
// in the components/tools folder. The DB just holds metadata and structure.
export interface ITool extends Document {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  // category stores the Category slug string (e.g. "finance")
  category: string;
  inputs: any[];
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    // Stores the Category.slug string — no enum, fully dynamic
    category: { type: String, default: "other" },
    inputs: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

// Text index for full-text search across name and description
ToolSchema.index({ name: "text", description: "text" });

export default mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);
