# Zylo Tech — Wealth & Opportunity Master Class 2026

A self-contained webinar landing page with lead capture, Hubtel payments, and
Resend thank-you emails. Registrations are stored in this project's own backend
(a local JSON datastore) — no external database required.

```
webinar/
├── server.js            # Express app + API endpoints
├── src/
│   ├── config.js        # Reads .env, single source of truth for webinar + pricing
│   ├── store.js         # JSON-file datastore (data/registrations.json)
│   ├── hubtel.js        # Hubtel checkout initiate + status verification
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
| `HUBTEL_API_ID` / `HUBTEL_API_KEY` | Your [Hubtel](https://developers.hubtel.com) API credentials (API ID = Basic-auth username, API Key = password). Used server-side only. |
| `HUBTEL_MERCHANT_ACCOUNT` | Your Hubtel **POS Sales / Merchant Account Number** — required to initiate a checkout and check a transaction's status. |
| `PUBLIC_BASE_URL` | The public URL of this server (e.g. your domain, or an ngrok URL in dev). Hubtel posts its payment callback and redirects the customer back to URLs built from this. |
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys). Without it, emails are logged to the console instead of sent. |
| `FROM_EMAIL` | Sender, e.g. `Zylo Tech Solutions <hello@zylotech.com>`. The domain must be verified in Resend. |
| `ADMIN_TOKEN` | A long random string that protects your leads list. |

## How the flow works

1. Visitor fills the form → `POST /api/register` saves a **pending** lead and asks Hubtel to create a checkout (`POST /items/initiate`), returning a hosted `checkoutUrl`.
2. The browser redirects to Hubtel's secure checkout page; the customer pays (Mobile Money or card).
3. Hubtel then does two things: it **POSTs a server-to-server callback** to `/api/hubtel/callback` (the source of truth), and it **redirects the customer back** to the site with `?ref=…&pay=return`.
4. Either path calls `confirmPayment()`, which verifies the transaction via Hubtel's **Status Check API**, marks the lead **paid**, mirrors it to Airtable, and sends the Resend thank-you email. The return page polls `GET /api/pay/status` and shows the confirmation.

Payment confirmation is done **server-side** and checks the amount, so the price can't be tampered with from the browser. Because Hubtel calls back to `PUBLIC_BASE_URL`, that must be publicly reachable (use ngrok in dev — see `ngrok-out.txt`).

## Your leads (the backend list)

Every registration is stored in `data/registrations.json`. View or export them:

- **JSON:** `http://localhost:4000/admin/registrations?token=YOUR_ADMIN_TOKEN`
- **CSV (for Excel/Sheets):** `http://localhost:4000/admin/registrations.csv?token=YOUR_ADMIN_TOKEN`

## Data & automation pipeline

```
Checkout / Registration  →  Airtable  →  Zapier  →  Resend
   (this backend)          (CRM /        (no-code     (emails)
                            source of     automation)
                            record)
```

The backend writes every registration to **Airtable**; **Zapier** watches that table and
drives **Resend** (emails). The local `data/registrations.json` is kept as a backup.

> By default the backend already sends the confirmation email directly via Resend, so
> the Zapier step is optional — use it if you want a no-code layer for reminders/nurture.

### 1. Airtable — create the table

Create a base with a table named **`Registrations`** (or set `AIRTABLE_TABLE_NAME`) with
these fields — names must match exactly:

| Field | Type |
|---|---|
| `Name` | Single line text |
| `Email` | Email |
| `Phone` | Phone number |
| `Status` | Single select (`Registered`, `Paid`) |
| `Price (GHS)` | Number |
| `Reference` | Single line text |
| `Registered At` | Date (include time) |
| `Paid At` | Date (include time) |
| `Channel` | Single line text |
| `Source` | Single line text |

Create a Personal Access Token at <https://airtable.com/create/tokens> with scopes
`data.records:write` (and `data.records:read`) on this base, then set `AIRTABLE_API_KEY`,
`AIRTABLE_BASE_ID` (starts `app…`), and `AIRTABLE_TABLE_NAME` in `.env`.

The backend **creates** a row on registration and **updates** it to `Status = Paid`
(with `Paid At` / `Channel`) after payment is verified — so you can trigger different
Zaps for new leads vs. confirmed buyers.

### 2. Zapier — from Airtable to Resend

Optional (the backend already sends the confirmation email itself). Use Zapier if you
want a no-code layer for the emails or a nurture sequence:

**Resend (transactional confirmation email)**
1. **Trigger:** Airtable → *New or Updated Record*, **Filter** `Status = Paid`.
2. **Action:** Resend → *Send Email* (or Webhooks → POST to the Resend API), mapping
   `Email`, `Name`, and `Reference` into your template (see `templates/`).

### 3. Avoid duplicate emails

If you set up the Zap above to send the confirmation email, set
**`BACKEND_SENDS_EMAIL=false`** in `.env` so the backend stops sending its own Resend
email. Leave it `true` (the default) if the backend should keep sending directly.

### 4. Reminder email ("24 hours to go")

On-brand HTML templates live in `templates/` (ivory/clay, matching the site):

| File | Email | For |
|---|---|---|
| `templates/confirmation-email.html` | Confirmation, on registration/payment | Resend / Zapier (`{{tokens}}`) |
| `templates/reminder-email.html` | Reminder, ~24 h before the class | Resend / Zapier (`{{tokens}}`) |

These are the same emails the backend generates in `src/email.js`. The `{{token}}` copies
in `templates/` are for pasting into a Zapier *Resend → Send Email* action if you prefer to
drive the emails from Zapier instead of the backend.

**Option A — scheduled Zap (recommended):** *Schedule by Zapier* (the day before) →
Airtable *Find Records* where `Status = Paid` → Resend *Send Email* using
`reminder-email.html`. Subject: `Starts tomorrow — Wealth & Opportunity Master Class 2026`.

**Option B — backend trigger:** if you're not using Zapier for this, POST to
`/admin/send-reminders` (admin-token protected) the day before and the backend emails
every confirmed registrant via Resend:

```bash
curl -X POST "http://localhost:4000/admin/send-reminders?token=YOUR_ADMIN_TOKEN"
# → { "total": 42, "sent": 42, "failed": 0, "failures": [] }
```

Point a cron job / uptime pinger at that URL to automate it. It isn't idempotent, so
trigger it once.

> Airtable is optional: if `AIRTABLE_API_KEY`/`AIRTABLE_BASE_ID` are unset, the backend
> just skips it and keeps working with the local store + direct Resend email.

## Testing without live keys

Set `DEV_FAKE_PAYMENTS=true` in `.env` to simulate a successful payment without
calling Hubtel — the checkout "redirect" sends you straight back to the return page and
the whole register → confirm → email flow runs end-to-end so you can test the page.
**Set it back to `false` before going live.**

## Deploying

Any Node host works (Render, Railway, a VPS, etc.). Set the same env vars there,
run `npm start`, and point your domain at it. Set `PUBLIC_BASE_URL` to the deployed
HTTPS URL so Hubtel's callback and return redirects reach it, and use your live Hubtel
credentials + merchant account number.

> Note: the flier art says "Sat 4th July 2026"; this build uses a **4-day run, July 17–20, 2026
> (Fri–Mon)**, starting next Friday per the campaign brief. Change it any time in `.env` (`WEBINAR_DATE_*`).
