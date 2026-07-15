# Zylo-Business-Website

Digital home of **Zylo Tech Solutions** (registered in Ghana) — a marketing website plus
a standalone webinar campaign with lead capture and payments.

## Structure

| Folder | What it is |
|---|---|
| `zylotech` | Main marketing site — React 18 + Vite + TypeScript + Tailwind (Home, Products, About, Blog, Contact). |
| `webinar` | Self-contained "Wealth & Opportunity Master Class 2026" landing page + Express backend (lead capture, Paystack payments, Resend confirmation emails, CSV lead export). |
| `ai` | Build specs and notes. |
| `backend` | Reserved for shared backend services. |

## Getting started

```bash
# Main site
cd zylotech && npm install && npm run dev

# Webinar campaign
cd webinar && npm install && cp .env.example .env && npm start
```

See `webinar/README.md` for the webinar backend, payment, and email setup.

## Notes
- Real secrets (`.env`) and `node_modules/` are git-ignored. Copy `webinar/.env.example`
  to `webinar/.env` and add your own keys locally.
