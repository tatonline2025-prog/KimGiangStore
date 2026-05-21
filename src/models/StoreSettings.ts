import { Schema, model, models } from "mongoose";

const StoreSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    storeName: { type: String, default: "KIM GIANG ANTIQUES" },
    menuItems: {
      type: [String],
      default: ["Collections", "The Treasury", "Services", "Provenance", "About", "Contact"],
    },
    heroTitle: {
      type: String,
      default: "PRESERVING THE LEGACY OF ANCIENT ART: WHERE HISTORY FINDS ITS HOME.",
    },
    heroSubtitle: {
      type: String,
      default: "Explore curated artifacts and documented provenance from distinguished collections.",
    },
    treasuryTitle: { type: String, default: "THE TREASURY" },
    provenanceTitle: {
      type: String,
      default: "PROVENANCE & CERTIFICATE OF AUTHENTICITY",
    },
    provenanceDescription: {
      type: String,
      default:
        "Uncompromising trust, documented history, and verified ownership records for every artifact.",
    },
    paymentLabels: {
      type: [String],
      default: ["VISA", "MASTERCARD", "2CHECKOUT", "STRIPE", "QR TRANSFER"],
    },
    contactEmail: { type: String, default: "contact@kimgiangantiques.com" },
    contactPhone: { type: String, default: "+84 888 668 999" },
    contactAddress: { type: String, default: "Hoi An, Viet Nam" },
    instagramUrl: { type: String, default: "https://instagram.com" },
    facebookUrl: { type: String, default: "https://facebook.com" },
    tiktokUrl: { type: String, default: "https://tiktok.com" },
    allowStripe: { type: Boolean, default: true },
    allowTwoCheckout: { type: Boolean, default: true },
    allowQr: { type: Boolean, default: true },
    stripePublicKey: { type: String, default: "" },
    stripeWebhookEndpoint: { type: String, default: "/api/webhooks/stripe" },
    twoCheckoutSellerId: { type: String, default: "" },
    twoCheckoutWebhookEndpoint: { type: String, default: "/api/webhooks/twocheckout" },
    qrProviderName: { type: String, default: "VietQR" },
    qrCallbackEndpoint: { type: String, default: "/api/webhooks/qr" },
    qrBankBin: { type: String, default: "970415" },
    qrBankAccount: { type: String, default: "0123456789" },
    qrAccountName: { type: String, default: "KIM GIANG ANTIQUES" },
  },
  { timestamps: true },
);

export const StoreSettings =
  models.StoreSettings || model("StoreSettings", StoreSettingsSchema);
