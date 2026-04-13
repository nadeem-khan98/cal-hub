import mongoose, { Schema, Document } from "mongoose";

// A dynamic generic schema for tools.
// Complex formula logic will be mapped via a static slug using predefined functions
// in the components/tools folder. The DB just holds metadata and structure if we want.
export interface ITool extends Document {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  // This could represent an array of required inputs (JSON stringified or exact schema)
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
    inputs: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);
