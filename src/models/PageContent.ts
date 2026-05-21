import mongoose from "mongoose";

const PageContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { timestamps: true },
);

export const PageContent =
  mongoose.models.PageContent ??
  mongoose.model("PageContent", PageContentSchema);
