import crypto from "crypto";

import QRCode from "qrcode";

import { env } from "@/lib/env";

function makeTransferContent(orderId: string) {
  const bankBin = env.qrBankBin ?? "970415";
  const account = env.qrBankAccount ?? "0123456789";
  const accountName = env.qrAccountName ?? "KIM GIANG ANTIQUES";

  return `BANK:${bankBin}|ACC:${account}|NAME:${accountName}|AMOUNT_USD:${orderId}`;
}

export async function createQrSession(params: { orderId: string; amountUsd: number }) {
  const transferContent = makeTransferContent(params.orderId);
  const payload = `${transferContent}|TOTAL:${params.amountUsd}`;
  const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 360 });

  return {
    providerRef: `qr_${params.orderId}`,
    qrDataUrl,
    transferContent,
  };
}

export function verifyQrCallbackSignature(payload: string, signature: string) {
  if (!env.qrProviderSecret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", env.qrProviderSecret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
