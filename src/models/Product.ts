import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    dynasty: { type: String, required: true },
    priceUsd: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    provenanceCode: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ProductInput = {
  name: string;
  slug: string;
  dynasty: string;
  priceUsd: number;
  imageUrl: string;
  shortDescription: string;
  longDescription: string;
  provenanceCode: string;
  active?: boolean;
};

export const Product = models.Product || model("Product", ProductSchema);
