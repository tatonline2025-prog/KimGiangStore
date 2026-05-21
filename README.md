# KimGiang Store

Luxury ecommerce storefront inspired by Kim Giang Antiques visuals, including:

- Storefront homepage with hero, treasury grid, provenance section, and checkout widget
- Admin panel for product and order management
- Payment integration layer for Stripe, 2Checkout, and QR transfer flows
- Webhook endpoints with signature verification and payment status updates

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- MongoDB + Mongoose
- Tailwind CSS
- Stripe SDK
- Custom 2Checkout signer/verifier
- QRCode generation for bank transfer flow

## Local Setup

1. Copy .env.example to .env.local
2. Fill MongoDB and payment keys
3. Install deps
4. Run dev server

Commands:

1. npm install
2. npm run dev
3. npm run lint
4. npm run build

## Environment Variables

See .env.example for all keys:

- MONGODB_URI
- NEXT_PUBLIC_BASE_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- TWOCHECKOUT_SELLER_ID
- TWOCHECKOUT_SECRET_KEY
- TWOCHECKOUT_WEBHOOK_SECRET
- QR_PROVIDER_SECRET
- QR_BANK_BIN
- QR_BANK_ACCOUNT
- QR_ACCOUNT_NAME

## Routes

- Storefront: /
- Admin: /admin
- Checkout fallback pages:
	- /checkout/success
	- /checkout/cancel
	- /checkout/simulated

API:

- /api/products
- /api/products/[id]
- /api/checkout
- /api/admin/orders
- /api/webhooks/stripe
- /api/webhooks/twocheckout
- /api/webhooks/qr

## Production Notes

- Do not trust frontend payment success state.
- Always update order/payment records from verified webhooks.
- Protect admin route with auth + RBAC + MFA before go-live.
- Add idempotency storage per webhook event id in production.
