export const env = {
  mongoUri: process.env.MONGODB_URI,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  twoCheckoutSellerId: process.env.TWOCHECKOUT_SELLER_ID,
  twoCheckoutSecretKey: process.env.TWOCHECKOUT_SECRET_KEY,
  twoCheckoutWebhookSecret: process.env.TWOCHECKOUT_WEBHOOK_SECRET,

  qrProviderSecret: process.env.QR_PROVIDER_SECRET,
  qrBankBin: process.env.QR_BANK_BIN,
  qrBankAccount: process.env.QR_BANK_ACCOUNT,
  qrAccountName: process.env.QR_ACCOUNT_NAME,
};
