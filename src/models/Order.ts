import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        priceUsd: { type: Number, required: true },
      },
    ],
    totalUsd: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["stripe", "twocheckout", "qr"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentReference: { type: String },
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", OrderSchema);
