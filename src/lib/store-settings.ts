import { connectDb } from "@/lib/db";
import { StoreSettings } from "@/models/StoreSettings";

export const defaultStoreSettings = {
  storeName: "KIM GIANG ANTIQUES",
  menuItems: ["Collections", "The Treasury", "Services", "Provenance", "About", "Contact"],
  heroTitle: "PRESERVING THE LEGACY OF ANCIENT ART: WHERE HISTORY FINDS ITS HOME.",
  heroSubtitle:
    "Explore curated artifacts and documented provenance from distinguished collections.",
  treasuryTitle: "THE TREASURY",
  provenanceTitle: "PROVENANCE & CERTIFICATE OF AUTHENTICITY",
  provenanceDescription:
    "Uncompromising trust, documented history, and verified ownership records for every artifact.",
  paymentLabels: ["VISA", "MASTERCARD", "2CHECKOUT", "STRIPE", "QR TRANSFER"],
  contactEmail: "contact@kimgiangantiques.com",
  contactPhone: "+84 888 668 999",
  contactAddress: "Hoi An, Viet Nam",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  tiktokUrl: "https://tiktok.com",
  allowStripe: true,
  allowTwoCheckout: true,
  allowQr: true,
  stripePublicKey: "",
  stripeWebhookEndpoint: "/api/webhooks/stripe",
  twoCheckoutSellerId: "",
  twoCheckoutWebhookEndpoint: "/api/webhooks/twocheckout",
  qrProviderName: "VietQR",
  qrCallbackEndpoint: "/api/webhooks/qr",
  qrBankBin: "970415",
  qrBankAccount: "0123456789",
  qrAccountName: "KIM GIANG ANTIQUES",
};

export async function getStoreSettings() {
  const dbReady = await connectDb();
  if (!dbReady) {
    return defaultStoreSettings;
  }

  const settings = await StoreSettings.findOne({ key: "default" }).lean();
  if (!settings) {
    const created = await StoreSettings.create({ key: "default", ...defaultStoreSettings });
    return {
      ...defaultStoreSettings,
      ...created.toObject(),
    };
  }

  return {
    ...defaultStoreSettings,
    ...settings,
  };
}
