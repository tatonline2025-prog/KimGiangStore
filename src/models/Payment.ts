import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    provider: {
      type: String,
      enum: ["stripe", "twocheckout", "qr"],
      required: true,
    },
    providerRef: { type: String, required: true },
    amountUsd: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    rawPayload: { type: Schema.Types.Mixed },
    signatureVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Payment = models.Payment || model("Payment", PaymentSchema);
