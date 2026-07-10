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

## Data & automation pipeline

```
Checkout / Registration  →  Airtable  →  Zapier  →  Mailchimp / Resend
   (this backend)          (CRM /        (no-code     (audience + emails)
                            source of     automation)
                            record)
```

The backend writes every registration to **Airtable**; **Zapier** watches that table and
drives **Mailchimp** (audience/tags) and/or **Resend** (emails). The local
`data/registrations.json` is kept as a backup.

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

### 2. Zapier — from Airtable to Mailchimp / Resend

Build one or both Zaps in your Zapier account:

**Mailchimp (audience + welcome automation)**
1. **Trigger:** Airtable → *New or Updated Record* on the `Registrations` table.
2. *(optional)* **Filter:** only continue if `Status` is `Paid` (or `Registered` for a lead nurture).
3. **Action:** Mailchimp → *Add/Update Subscriber* — map `Email`, `Name`; add a tag like
   `master-class-2026`. A Mailchimp automation can then send the welcome/reminder series.

**Resend (transactional confirmation email)**
1. **Trigger:** Airtable → *New or Updated Record*, **Filter** `Status = Paid`.
2. **Action:** Resend → *Send Email* (or Webhooks → POST to the Resend API), mapping
   `Email`, `Name`, and `Reference` into your template.

### 3. Avoid duplicate emails

Once a Zap sends the confirmation email, set **`BACKEND_SENDS_EMAIL=false`** in `.env` so
the backend stops sending its own Resend email. Leave it `true` if you'd rather the backend
keep sending directly and use Zapier only for Mailchimp list-building.

### 4. Reminder email ("24 hours to go")

On-brand HTML templates live in `templates/` (ivory/clay, matching the site):

| File | Email | For |
|---|---|---|
| `templates/confirmation-email.html` | Confirmation, on registration/payment | Resend / Zapier (`{{tokens}}`) |
| `templates/reminder-email.html` | Reminder, ~24 h before the class | Resend / Zapier (`{{tokens}}`) |
| `templates/mailchimp/welcome-email.html` | Welcome, when added to the audience | **Mailchimp** (`*|MERGE|*` tags) |
| `templates/mailchimp/reminder-email.html` | Reminder | **Mailchimp** (`*|MERGE|*` tags) |

**Mailchimp emails are built inside Mailchimp**, not sent by this backend. The two files in
`templates/mailchimp/` are ready to paste into Mailchimp → *Create → Email → "Code your own"*
(or as an Automation email). They use Mailchimp merge tags (`*|FNAME|*`) and include the
required unsubscribe + physical-address footer. Before sending, replace `[[ZOOM_LINK]]` and
`[[WHATSAPP_NUMBER]]`, and set an audience default for `FNAME` (e.g. "there").

> Rule of thumb: **Resend** for the transactional receipt (Zoom link + reference),
> **Mailchimp** for the audience, welcome, and any newsletter/nurture. Pick one sender per
> message so nobody gets duplicates.

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
calling Paystack — the whole register → confirm → email flow runs end-to-end so you
can test the page. **Set it back to `false` before going live.**

## Deploying

Any Node host works (Render, Railway, a VPS, etc.). Set the same env vars there,
run `npm start`, and point your domain at it. For Paystack live payments, use your
`pk_live_…` / `sk_live_…` keys and add the deployed URL to your Paystack dashboard.

> Note: the flier art says "Sat 4th July 2026"; this build uses a **4-day run, July 17–20, 2026
> (Fri–Mon)**, starting next Friday per the campaign brief. Change it any time in `.env` (`WEBINAR_DATE_*`).
