# Zylo Tech — Wealth & Opportunity Master Class 2026

A self-contained webinar landing page with lead capture, Paystack payments, and
Resend thank-you emails. Registrations are stored in this project's own backend
(a local JSON datastore) — no external database required.

```
webinar/
├── server.js            # Express app + API endpoints
├── src/
│   ├── config.js        # Reads .env, single source of truth for webinar + pricing
│   ├── store.js         # JSON-file datastore (data/registrations.json)
│   ├── paystack.js      # Server-side payment verification
│   └── email.js         # Resend thank-you email
├── public/
│   └── index.html       # The landing page (flier-styled, dark theme)
├── data/                # created at runtime — your leads live here (git-ignored)
├── .env.example         # copy to .env and fill in
└── package.json
```

## Quick start

```bash
cd webinar
npm install
cp .env.example .env      # then edit .env (see below)
npm start                 # → http://localhost:4000
```

Open http://localhost:4000 to see the landing page.

## Configure `.env`

| Key | What it's for |
|---|---|
| `WEBINAR_DATE_ISO` / `WEBINAR_DATE_LABEL` / `WEBINAR_TIME_LABEL` | Class date & time. `DATE_ISO` is the start (drives the countdown); the labels drive the page copy. Currently a **4-day event: July 17–20, 2026 (Fri–Mon), 7:00 PM GMT daily**. |
| `WEBINAR_ZOOM_LINK` | The Zoom join link included in the confirmation email. |
| `PRICE_GHS` | Ticket price in cedis (**200**). Set to `0` for free lead-gen mode (no payment). |
| `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` | From your [Paystack dashboard](https://dashboard.paystack.com/#/settings/developers). Public key is used in the browser; secret key verifies payments server-side. |
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys). Without it, emails are logged to the console instead of sent. |
| `FROM_EMAIL` | Sender, e.g. `Zylo Tech Solutions <hello@zylotech.com>`. The domain must be verified in Resend. |
| `ADMIN_TOKEN` | A long random string that protects your leads list. |

## How the flow works

1. Visitor fills the form → `POST /api/register` saves a **pending** lead and returns a payment reference.
2. Paystack checkout opens in the browser (Mobile Money or card).
3. On success → `POST /api/pay/verify` verifies the transaction with your **secret key**, marks the lead **paid**, and sends the Resend thank-you email.
4. The visitor sees a confirmation with their reference.

Payment verification is done **server-side** and checks the amount, so the price can't be tampered with from the browser.

## Your leads (the backend list)

Every registration is stored in `data/registrations.json`. View or export them:

- **JSON:** `http://localhost:4000/admin/registrations?token=YOUR_ADMIN_TOKEN`
- **CSV (for Excel/Sheets):** `http://localhost:4000/admin/registrations.csv?token=YOUR_ADMIN_TOKEN`

## Testing without live keys

Set `DEV_FAKE_PAYMENTS=true` in `.env` to simulate a successful payment without
calling Paystack — the whole register → confirm → email flow runs end-to-end so you
can test the page. **Set it back to `false` before going live.**

## Deploying

Any Node host works (Render, Railway, a VPS, etc.). Set the same env vars there,
run `npm start`, and point your domain at it. For Paystack live payments, use your
`pk_live_…` / `sk_live_…` keys and add the deployed URL to your Paystack dashboard.

> Note: the flier art says "Sat 4th July 2026"; this build uses a **4-day run, July 17–20, 2026
> (Fri–Mon)**, starting next Friday per the campaign brief. Change it any time in `.env` (`WEBINAR_DATE_*`).
