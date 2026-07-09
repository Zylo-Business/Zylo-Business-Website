# Zylo Tech Solutions — Website Build Specification

**The complete AI prompt document for building the Zylo Tech Solutions website in React + Vite + Tailwind CSS**

> Registered in Ghana | Built with Claude (Anthropic)

---

## How to use this document

Paste the relevant section into Claude, ChatGPT, Cursor, GitHub Copilot, or any AI coding tool. Each section is a self-contained prompt. Build section by section, day by day. The Master Prompt in Section 1 gives any AI everything it needs to understand the full project.

---

## Tech stack summary

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast build tool, instant hot reload |
| Language | JavaScript (JSX) | TypeScript optional — add later |
| Styling | Tailwind CSS v3 + shadcn/ui | Utility classes + pre-built components |
| Routing | React Router v6 | Client-side navigation between 5 pages |
| Forms | React Hook Form + EmailJS | Contact form without any backend |
| SEO | React Helmet Async | Per-page meta tags and titles |
| Icons | Lucide React | Clean SVG icon library |
| Email capture | Mailchimp embedded form | Inside a React component |
| Payments | Selar.co buy buttons | Embedded directly — no backend needed |
| Deployment | Vercel | Free, connects to GitHub, live in 2 minutes |
| Domain | Custom domain on Vercel | zylotech.com or zylotechgh.com |

---

## 14-Day Build Plan

| Days | Task |
|---|---|
| Day 1 | Install + scaffold — run all setup commands |
| Day 2 | App.jsx routing + Navbar + Footer |
| Day 3 | Tailwind config + design system tokens |
| Day 4 | Hero section + Home page structure |
| Day 5 | Products page + ProductCard component |
| Day 6 | About page |
| Day 7 | Blog list page + BlogPost reader |
| Day 8 | Contact page + EmailJS form |
| Day 9 | Mailchimp email list embed |
| Day 10 | Selar.co buy buttons on all products |
| Day 11 | SEO meta tags on every page |
| Day 12 | Mobile responsiveness polish |
| Day 13 | Deploy to Vercel |
| Day 14 | Connect custom domain + launch |

---

## Setup commands — run in order

```bash
# 1. Create the project
npm create vite@latest zylo-tech-website -- --template react
cd zylo-tech-website
npm install

# 2. Install all dependencies at once
npm install react-router-dom react-helmet-async
npm install react-hook-form emailjs-com
npm install lucide-react

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install shadcn/ui
npx shadcn-ui@latest init

# 5. Start dev server
npm run dev
```

---

## Folder structure

```
zylo-tech-website/
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Hero, features, testimonials, CTA
│   │   ├── Products.jsx      # All products + Selar.co buy buttons
│   │   ├── About.jsx         # Story, credentials, expertise pillars
│   │   ├── Blog.jsx          # Blog post list + filters
│   │   ├── BlogPost.jsx      # Individual post reader
│   │   └── Contact.jsx       # Form + Calendly + social links
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky nav + mobile hamburger
│   │   ├── Footer.jsx        # Links, socials, copyright
│   │   ├── Hero.jsx          # Homepage hero section
│   │   ├── ProductCard.jsx   # Reusable product tile
│   │   ├── BlogCard.jsx      # Blog post preview card
│   │   ├── TestimonialCard.jsx # Quote, name, rating
│   │   ├── SectionHeader.jsx # Reusable title + subtitle
│   │   └── SEOMeta.jsx       # React Helmet wrapper
│   ├── data/
│   │   ├── products.js       # All product data
│   │   ├── posts.js          # Blog post content
│   │   └── testimonials.js   # Customer testimonials
│   ├── config/
│   │   └── emailjs.js        # EmailJS API keys
│   ├── assets/               # Logo and images
│   ├── App.jsx               # Router setup
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind directives + globals
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

---

# Section 1: The Master Prompt

> **Paste this entire block into any AI to get the full project scaffold built at once.**

```
You are building a professional business website for Zylo Tech Solutions,
a digital products company registered in Ghana.

TEAM PROFILE:
Name: Anthony Enchia
Business: Zylo Tech Solutions, Ghana
Expertise: Computer Programmer, Cryptocurrency Trader, Lottery Forecaster
Products sold on: Selar.co (Ghana-based digital product platform)
Payment processor: Paystack (Ghana mobile money + cards)

Name: Emmanuel Obeng
Business: Zylo Tech Solutions, Ghana
Expertise: Social Media Manager, Cryptocurrency Trader, Lottery Forecaster
Products sold on: Selar.co (Ghana-based digital product platform)
Payment processor: Paystack (Ghana mobile money + cards)

TECH STACK (use exactly this, no alternatives):
- React 18 + Vite (already scaffolded)
- React Router v6 for routing
- Tailwind CSS v3 for all styling
- shadcn/ui for UI components
- Lucide React for icons
- React Hook Form for contact form
- EmailJS for form submission without a backend
- React Helmet Async for SEO meta tags
- Deploy to Vercel

COLOUR SCHEME (use these exact hex values):
- Primary:    Deep Teal  #0F6E56
- Secondary:  Navy Blue  #1B3A6B
- Accent:     Gold       #8B5E0A
- Background: White      #FFFFFF
- Text:       Dark       #111827
- Surface:    Light Gray #F4F3EF

TYPOGRAPHY:
- Headings: Poppins (import from Google Fonts)
- Body:     Inter (import from Google Fonts)
- Mono:     JetBrains Mono (code sections only)

THE 5 PAGES TO BUILD:
1. /           Home     — Hero, value prop, product highlights, testimonials, CTA
2. /products   Products — All digital products with Selar.co buy buttons
3. /about      About    — Personal story, credentials, expertise pillars
4. /blog       Blog     — Post list with category filters + individual post reader
5. /contact    Contact  — EmailJS form + Calendly link + social links

BUSINESS CONTEXT:
Zylo Tech Solutions sells digital products to:
- Pastors and church leaders in Ghana and West Africa
- Cryptocurrency traders in Ghana and West Africa
- Self-taught programmers and CS students
- Lottery enthusiasts wanting data-driven analysis tools

TONE:
- Professional but warm
- Credible and trustworthy
- Locally relevant — Ghana and West Africa context
- Personal expert brand, not a corporate company

COMPONENTS TO BUILD in /src/components/:
- Navbar.jsx          — sticky, mobile hamburger, smooth scroll
- Footer.jsx          — links, socials, WhatsApp button, copyright
- Hero.jsx            — headline, subheadline, two CTA buttons, background pattern
- ProductCard.jsx     — image, title, GHS price, description, buy button
- BlogCard.jsx        — thumbnail, title, date, excerpt, read more link
- TestimonialCard.jsx — quote, name, role, star rating
- SectionHeader.jsx   — reusable section title + subtitle
- SEOMeta.jsx         — React Helmet Async wrapper for per-page SEO

SPECIAL REQUIREMENTS:
- Every page must have unique SEO title and description via React Helmet Async
- Products page embeds Selar.co buy links as <a> tags opening in a new tab
- Contact form sends email via EmailJS — I will add API keys later
- Mobile-first: every component must be fully responsive (Tailwind breakpoints)
- WhatsApp floating button fixed bottom-right: wa.me/[my number]
- Loading state on all buttons
- Smooth scroll behavior throughout
- Route change scrolls to top of page

START BY building: App.jsx with all routes, then Navbar.jsx, then Footer.jsx,
then each page in order. Ask me before making any decision not covered above.
```

---

---

# Section 2: Page-by-Page Build Prompts

---

## Page 1 — Home.jsx

The homepage converts visitors into buyers. Must communicate who you are and what you sell within 5 seconds.

```
Build the complete Home.jsx page for Zylo Tech Solutions with these sections:

SECTION 1 — HERO:
- Headline: "Digital Products Built for Africa's Builders, Traders & Ministers"
- Subheadline: "I am a pastor, programmer, and crypto trader based in Ghana.
  I build practical tools, courses, and guides that solve real problems."
- CTA Button 1 (primary teal): "Browse All Products" → links to /products
- CTA Button 2 (outline navy): "Join Free Community" → opens Telegram link in new tab
- Background: subtle geometric pattern using Tailwind, teal/navy palette

SECTION 2 — TRUST BAR:
- 4 stats in a horizontal strip:
  "500+ Students" | "GHS 0 to First Sale in 14 Days" | "3 Expertise Areas" | "Ghana Registered"

SECTION 3 — FEATURED PRODUCTS (3 cards):
- Use the ProductCard component
- Import sample data from /data/products.js (first 3 products)
- "View All Products" button linking to /products

SECTION 4 — WHO I SERVE (3 columns with icons):
- Column 1: Pastors and church leaders
- Column 2: Crypto traders in West Africa
- Column 3: Self-taught developers and programmers
- Each with a Lucide icon, headline, and 2-line description

SECTION 5 — TESTIMONIALS (2-3 cards):
- Use TestimonialCard component
- Import from /data/testimonials.js

SECTION 6 — EMAIL CAPTURE:
- Headline: "Get Free Ministry and Trading Tips Every Week"
- Mailchimp embed form (leave <!-- MAILCHIMP FORM HERE --> placeholder)
- Teal background section

SECTION 7 — BOTTOM CTA BAR:
- "Ready to learn from a pastor who can code?" + button to /products

Include SEOMeta with:
title="Zylo Tech Solutions | Digital Products for Ghana"
description="Digital products for pastors, crypto traders, and programmers in Ghana and West Africa."
```

---

## Page 2 — Products.jsx

The most important revenue page. Every product must have a clear Selar.co buy button and price in GHS.

```
Build the complete Products.jsx page for Zylo Tech Solutions.

CATEGORY FILTER TABS (active state in teal):
- All (default)
- Ministry and Church
- Cryptocurrency and Trading
- Programming and Tech
- Lottery and Forecasting

PAGE FEATURES:
- Category filter tabs at the top
- Product grid: 3 columns desktop, 2 tablet, 1 mobile
- Each ProductCard shows: title, category badge (colour-coded), price (GHS bold + USD small),
  description (3 lines clamped), 3 feature bullets with teal checkmarks, "Buy Now" button
- "Best Seller" and "New" ribbon on selected products
- Smooth filter animation (show/hide based on selected category)
- Empty state message if a filter returns no products
- Loading skeleton shown while filtering

FAQ SECTION at the bottom:
- "How do I receive my product?" — Instant download link sent to your email after purchase
- "Can I pay with mobile money?" — Yes, via Paystack on Selar.co
- "Do you offer refunds?" — Yes, within 7 days if the product does not deliver value
- "Do you offer coaching?" — Yes, book via the Contact page

Include SEOMeta with descriptive title and meta description.
```

---

## Page 3 — About.jsx

The trust-building page. Visitors buy from people they know and believe in.

```
Build the complete About.jsx page for Zylo Tech Solutions.

SECTION 1 — HERO ABOUT:
- Photo placeholder (large circle, teal border) on left
- Right side:
  - Name: [Your Name]
  - Title: "Pastor | Programmer | Crypto Trader | Based in Ghana"
  - 3-sentence intro (leave [PLACEHOLDER] for me to fill in)
  - Two badges: "Ghana Registered Business" and "Est. 2024"

SECTION 2 — MY STORY:
- 3 paragraphs of personal narrative (leave [PLACEHOLDER TEXT] for me to fill in)
- Theme: the journey from ministry to programming to digital entrepreneurship
- End paragraph: why I built Zylo Tech Solutions and who it serves

SECTION 3 — THREE EXPERTISE PILLARS (3 cards, equal width):
- Card 1 (Teal): Ministry and Pastoral Work
  Icon, headline, 3 credential bullets (leave [PLACEHOLDER] for each)
- Card 2 (Navy): Computer Programming
  Icon, headline, 3 skill/experience bullets (leave [PLACEHOLDER])
- Card 3 (Gold): Cryptocurrency and Trading
  Icon, headline, 3 background bullets (leave [PLACEHOLDER])

SECTION 4 — WHY GHANA AND WEST AFRICA:
- Short paragraph about local context, GHS pricing, mobile money support
- 3-stat row: countries served, products built, community members (all [PLACEHOLDER])

SECTION 5 — WORK WITH ME (3 option boxes):
- Box 1: "Buy a Product" → /products
- Box 2: "Join the Community" → Telegram link
- Box 3: "Book a 1-on-1 Session" → Calendly link [PLACEHOLDER]

Include SEOMeta.
```

---

## Page 4 — Blog.jsx and BlogPost.jsx

Free educational content that builds trust and drives organic traffic from Google.

```
Build Blog.jsx (post list) and BlogPost.jsx (individual reader) for Zylo Tech Solutions.

BLOG LIST PAGE (/blog):
- Category filter tabs: All, Ministry, Crypto Trading, Programming, Lottery
- Search bar to filter posts by title or excerpt keyword (client-side, no API)
- Featured post (first post) displayed full-width at the top with large image
- Grid of BlogCard components below: 2 columns desktop, 1 column mobile
- Each BlogCard: category badge (colour-coded), title, excerpt (3 lines), date,
  read time, "Read Article" link with arrow icon
- Empty state if search returns no results

INDIVIDUAL POST PAGE (/blog/:slug):
- Use useParams() to get the slug from the URL
- Find the matching post from posts.js by slug
- Display: category badge, title (large, navy), date + read time, content as paragraphs
- Each paragraph in the content string (separated by \n\n) renders as its own <p> tag
- Sidebar on desktop (right column, 30% width):
  - "Related posts" (same category, max 3)
  - Email signup widget (Mailchimp placeholder)
- Bottom section:
  - "Share on WhatsApp" button (pre-fills message with post title + URL)
  - "Back to Blog" link with left arrow
- 404 message if slug is not found: "Post not found" with link back to /blog

Include SEOMeta on both pages. BlogPost uses dynamic title from post data:
title="{post.title} | Zylo Tech Blog"
```

---

## Page 5 — Contact.jsx

Where visitors become leads. The form must work. EmailJS handles email delivery without a backend.

```
Build the complete Contact.jsx page for Zylo Tech Solutions.

EMAILJS SETUP:
- Import emailjs from "emailjs-com"
- Import config from "../config/emailjs.js"
- Leave clear placeholders: YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY
- I will fill these in after setting up EmailJS at emailjs.com

PAGE LAYOUT: two columns on desktop, stacked on mobile

LEFT COLUMN — CONTACT INFO:
- Headline: "Get in Touch"
- Subtext: "Whether you want to buy a product, book a coaching session,
  or have a question — I read every message."
- WhatsApp link (wa.me/[PLACEHOLDER]) with MessageCircle icon
- Email link with Mail icon
- Telegram community link with Send icon
- "Book a 1-on-1 Session" button → Calendly link [PLACEHOLDER]
- Ghana flag emoji + "Based in Accra, Ghana"
- "Monday to Friday, 8am to 6pm GMT"

RIGHT COLUMN — CONTACT FORM (React Hook Form):
Fields:
- Name        (required, min 2 chars)
- Email       (required, valid email format)
- Subject     (select dropdown): "Product question" | "Coaching inquiry" |
               "Partnership" | "Technical support" | "Other"
- Message     (required, min 20 chars, textarea 4 rows)
- Submit button with loading state: "Send Message" → "Sending..." while in progress

FORM BEHAVIOUR:
- Inline validation errors shown below each field in red
- On success: green success box "Message sent! I will reply within 24 hours."
- On error: red error box "Something went wrong. Please try WhatsApp instead."
- Form resets completely after successful submission

FAQ ACCORDION at the bottom (3 items, open/close on click):
- "How quickly will you reply?" — Within 24 hours on weekdays
- "Do you offer refunds?" — Yes, within 7 days if the product does not deliver
- "Can I pay with mobile money?" — Yes, via Paystack on Selar.co

Include SEOMeta.
```

---

---

# Section 3: Component Build Prompts

---

## Navbar.jsx

```
Build Navbar.jsx for Zylo Tech Solutions. Requirements:

DESKTOP (above 768px):
- Logo on the far left: "ZYLO TECH" in teal, bold, with a Zap icon from Lucide
- Nav links in the middle: Home, Products, About, Blog, Contact
- Active link: teal colour + bottom border indicator (use React Router NavLink)
- CTA button on far right: "Get Products" → /products (teal filled, rounded)
- WhatsApp icon link at the very end (opens wa.me/[PLACEHOLDER] in new tab)

MOBILE (below 768px):
- Logo on left, hamburger Menu icon on right (use Lucide Menu icon)
- Clicking hamburger toggles a slide-down menu
- Mobile menu shows all nav links stacked vertically + CTA button
- Clicking any link closes the mobile menu automatically

STICKY BEHAVIOUR:
- position: fixed, top: 0, full width, z-index: 50
- White background always
- On scroll > 10px: add a subtle box-shadow using Tailwind shadow-sm
- Use useEffect + window scroll event listener for this

GENERAL:
- Use React Router NavLink for all internal links (automatic active detection)
- Close mobile menu when user clicks outside the menu
- Smooth transition on all state changes
```

---

## Footer.jsx

```
Build Footer.jsx for Zylo Tech Solutions. Requirements:

BACKGROUND: dark navy #1B3A6B, white text

TOP SECTION — 4 columns (stacked on mobile, 2-col tablet, 4-col desktop):

Column 1 — Brand:
- "ZYLO TECH" logo text in teal
- Tagline: "Digital products for Ghana's builders, traders and ministers."
- Social icons in a row: Facebook, Twitter/X, Telegram, Youtube, Linkedin (all from Lucide)
- Each icon links to [PLACEHOLDER] and opens in a new tab

Column 2 — Quick Links:
- Heading: "Quick Links"
- Links: Home, Products, About, Blog, Contact (React Router Link)

Column 3 — Products:
- Heading: "Our Products"
- Links to /products with category filter param:
  Ministry Tools, Crypto Products, Programming Tools, Lottery Analysis

Column 4 — Contact:
- Heading: "Contact"
- WhatsApp link with icon
- Email link with icon
- Telegram community link with icon
- "Book a Session" Calendly button [PLACEHOLDER link]

DIVIDER: thin white line at 10% opacity

BOTTOM BAR:
- Left: "© 2024 Zylo Tech Solutions. Registered in Ghana. All rights reserved."
- Right: "Built with Claude AI" (smaller, muted white)

All external links open in a new tab with rel="noopener noreferrer".
```

---

## ProductCard.jsx

```
Build ProductCard.jsx — a reusable product card. Props: { product }

Product object shape:
{
  id, title, category, price, usdPrice, description,
  features, selarLink, badge, badgeColor
}

CARD DESIGN:
- White background, 0.5px border, border-radius: 12px
- Hover effect: border colour turns teal, very slight upward lift (transform translate-y-1)
- Smooth transition on all hover states (transition-all duration-200)

CARD CONTENT (top to bottom):
1. Category badge (top-left): colour-coded pill
   ministry → teal background, navy text
   crypto → purple background, purple dark text
   programming → amber background, amber dark text
   lottery → green background, green dark text

2. Optional "Best Seller" or "New" ribbon (top-right corner, diagonal):
   Only shown if product.badge exists. Teal background, white text.

3. Product title: bold, navy, 18px, max 2 lines

4. Price row:
   - GHS price: large (22px), teal, bold
   - USD price: small (13px), gray, in parentheses next to GHS

5. Description: gray, 14px, clamped to 3 lines (line-clamp-3)

6. Features list: 3 bullet points
   - Teal Check icon from Lucide (16px) + feature text

7. "Buy Now" button: full width, teal filled, white text
   onClick: window.open(product.selarLink, "_blank")
   Disabled + loading spinner while link is opening

8. "Learn More" text link below (optional expand — just console.log for now)
```

---

## SEOMeta.jsx

```
Build SEOMeta.jsx for Zylo Tech Solutions using react-helmet-async.

Props: { title, description, keywords, ogImage }

Defaults if props are not passed:
- title:       "Zylo Tech Solutions"
- description: "Digital products for Ghana's pastors, crypto traders, and programmers."
- keywords:    "digital products Ghana, crypto trading Ghana, pastor tools, programming Ghana"
- ogImage:     "/og-image.png"

The component renders inside <Helmet>:
- <title>{title} | Zylo Tech Solutions</title>
- <meta name="description" content={description} />
- <meta name="keywords" content={keywords} />
- <meta name="author" content="Zylo Tech Solutions" />
- Open Graph: og:title, og:description, og:type="website", og:url, og:image
- Twitter card: twitter:card="summary_large_image", twitter:title, twitter:description

Also show me:
1. How to wrap App.jsx with <HelmetProvider> from react-helmet-async
2. An example of using <SEOMeta> inside any page component
```

---

---

# Section 4: Setup and Configuration Prompts

---

## App.jsx and main.jsx

```
Build the complete App.jsx and main.jsx for Zylo Tech Solutions.

App.jsx must:
- Import BrowserRouter, Routes, Route from react-router-dom
- Import HelmetProvider from react-helmet-async
- Import all pages: Home, Products, About, Blog, BlogPost, Contact
- Import Navbar and Footer
- Set up routes:
    /              → Home
    /products      → Products
    /about         → About
    /blog          → Blog (list)
    /blog/:slug    → BlogPost (individual post)
    /contact       → Contact
    *              → 404 page (build a simple inline 404 with a link back to /)
- Navbar appears above all routes
- Footer appears below all routes
- Wrap everything in HelmetProvider
- WhatsApp floating button (fixed, bottom-right corner, z-index 50):
    - Teal circle background, white MessageCircle icon from Lucide (24px)
    - Links to wa.me/[PLACEHOLDER] in new tab
    - Subtle pulse animation using Tailwind animate-pulse
- On every route change: scroll window to top (useEffect + useLocation)

main.jsx must:
- Import React, ReactDOM, App, and "./index.css"
- Use ReactDOM.createRoot for React 18
- Mount to document.getElementById("root")
```

---

## tailwind.config.js

```
Configure tailwind.config.js for Zylo Tech Solutions with custom design tokens.

Content array:
["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]

Add to theme.extend:

colors:
  teal:
    DEFAULT: "#0F6E56"
    light:   "#D8F0E7"
    dark:    "#085041"
    50:      "#D8F0E7"
    600:     "#0F6E56"
    800:     "#085041"
  navy:
    DEFAULT: "#1B3A6B"
    light:   "#E8EEF7"
    dark:    "#0F2040"
  gold:
    DEFAULT: "#8B5E0A"
    light:   "#FBF3DE"
    dark:    "#5C3D06"

fontFamily:
  sans:    ["Inter", "ui-sans-serif", "system-ui"]
  heading: ["Poppins", "Inter", "ui-sans-serif"]
  mono:    ["JetBrains Mono", "ui-monospace", "monospace"]

borderRadius:
  card:  "12px"
  badge: "6px"

boxShadow:
  card:       "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)"
  card-hover: "0 4px 12px rgba(0,0,0,0.12)"
  sticky:     "0 1px 4px rgba(0,0,0,0.10)"

Also update index.css to:
- Import Inter and Poppins from Google Fonts at the top
- Add @tailwind base, @tailwind components, @tailwind utilities
- Set html { scroll-behavior: smooth; }
- Set body { font-family: 'Inter', sans-serif; }
- Add thin custom scrollbar (teal thumb, light gray track)
```

---

## EmailJS configuration

```
Show me how to configure EmailJS in the Zylo Tech Solutions React project.

Step 1 — Create /src/config/emailjs.js:
export const EMAILJS_CONFIG = {
  SERVICE_ID:  "YOUR_SERVICE_ID",   // from emailjs.com → Email Services
  TEMPLATE_ID: "YOUR_TEMPLATE_ID",  // from emailjs.com → Email Templates
  PUBLIC_KEY:  "YOUR_PUBLIC_KEY"    // from emailjs.com → Account → API Keys
};

Step 2 — Show the complete sendEmail function for Contact.jsx:
- Uses emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
- Sets isLoading state true before sending, false in finally block
- Sets isSuccess true on resolve → shows green success message
- Sets isError true on reject → shows red error message
- Resets the form using reset() from React Hook Form on success

Step 3 — Show the EmailJS template variables to set up at emailjs.com:
{{from_name}}  — maps to the Name field
{{from_email}} — maps to the Email field
{{subject}}    — maps to the Subject dropdown
{{message}}    — maps to the Message textarea
{{to_name}}    — your name (set as a fixed value in the template)

Step 4 — Environment variables approach (optional but recommended):
Show how to store keys in a .env file and access them via import.meta.env.VITE_*
Remind me to add the .env file to .gitignore.
```

---

## Vercel deployment — step by step

```
Give me the complete step-by-step guide to deploy the Zylo Tech Solutions website
to Vercel with a custom domain.

Include:

1. Initialise Git:
   git init
   git add .
   git commit -m "Initial commit — Zylo Tech Solutions website"

2. Push to GitHub:
   - Create a new repository on github.com (name: zylo-tech-website)
   - Run the git remote add and git push commands

3. Connect to Vercel:
   - Go to vercel.com → New Project → Import from GitHub
   - Select the zylo-tech-website repository

4. Correct build settings for Vite React:
   Framework preset: Vite
   Build command:    npm run build
   Output directory: dist
   Install command:  npm install

5. Add environment variables in Vercel:
   Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY

6. Connect a custom domain:
   - Go to Project Settings → Domains → Add Domain
   - Enter your domain (e.g. zylotech.com or zylotechgh.com)
   - Show the DNS records I need to add at my domain registrar

7. Enable automatic deployments:
   Explain that every git push to main automatically redeploys — confirm this is on by default

8. Reading deployment logs:
   Where to find the build log when a deployment fails and what to look for
```

---

---

# Section 5: Data File Prompts

---

## products.js — all Zylo Tech products

```
Create /src/data/products.js for Zylo Tech Solutions with all 12 products.

Each product follows this structure:
{
  id:          1,
  title:       "Product Title",
  category:    "ministry",              // ministry | crypto | programming | lottery
  price:       "GHS 200",
  usdPrice:    "$18",
  description: "2-3 sentence description of what this product does and who it is for.",
  features:    ["Feature one", "Feature two", "Feature three"],
  selarLink:   "https://selar.co/YOUR-PRODUCT-LINK",  // I will fill these in
  badge:       "Best Seller",           // optional: "Best Seller" | "New" | "Popular"
  image:       "/images/product-1.jpg"  // placeholder path
}

MINISTRY AND CHURCH PRODUCTS (category: "ministry"):

1. "The Pastor's Admin Vault" — GHS 200 / $18
   20 church administration templates. Selar link: [PLACEHOLDER]
   Features: 20 ready-to-use templates, Instant download, Works for any church size
   Badge: Best Seller

2. "Preach That Moves" — GHS 250 / $22
   7-step sermon construction guide for non-seminary ministers. Selar link: [PLACEHOLDER]
   Features: 7-step framework, Sermon diagnosis tools, Works for any text or topic

3. "The Discipleship Pipeline" — GHS 350 / $30
   Complete discipleship system for any size church. Selar link: [PLACEHOLDER]
   Features: 4-stage pathway, Ready-made materials, Plug-and-play for any church
   Badge: New

4. "The Caring Pastor" — GHS 300 / $26
   Biblical counselling course for ministry leaders. Selar link: [PLACEHOLDER]
   Features: 6 video lessons, Counselling scripts, When to refer guide

5. "Closer: 30-Day Prayer Journal" — GHS 150 / $13
   Grace-based daily prayer journal. Selar link: [PLACEHOLDER]
   Features: 30 daily devotionals, Scripture + reflection + prayer, Printable PDF

CRYPTOCURRENCY AND TRADING PRODUCTS (category: "crypto"):

6. "Ghana Crypto Starter Blueprint" — GHS 200 / $18
   How to buy, trade and store Bitcoin safely from Ghana. Selar link: [PLACEHOLDER]
   Features: Mobile money on-ramp guide, Local exchange comparison, P2P safety rules
   Badge: Best Seller

7. "The Drawdown Shield" — GHS 300 / $26
   Crypto risk management system built in a Google Sheets spreadsheet. Selar: [PLACEHOLDER]
   Features: Position sizing calculator, Drawdown tracker, Risk rules enforced automatically

8. "Passive Crypto Income Playbook" — GHS 350 / $30
   Staking, DeFi, and yield strategies for West Africa. Selar link: [PLACEHOLDER]
   Features: 5 passive income methods, West Africa safe platforms, Step-by-step guides

PROGRAMMING PRODUCTS (category: "programming"):

9. "The Zylo Trading Script Pack" — GHS 500 / $44
   10 ready-to-run Python scripts for crypto alerts, backtesting, and portfolio tracking.
   Selar link: [PLACEHOLDER]
   Features: 10 working scripts, Full documentation, Works with free APIs
   Badge: Popular

10. "Python for Traders" — GHS 600 / $52
    Automate your trading strategy in 5 sessions. Selar link: [PLACEHOLDER]
    Features: 5 video sessions, Build a Telegram alert bot, No prior coding required

LOTTERY AND FORECASTING PRODUCTS (category: "lottery"):

11. "LottoScan Pro Spreadsheet" — GHS 180 / $16
    Frequency analysis tool that works for any lottery game. Selar link: [PLACEHOLDER]
    Features: Auto-generates frequency tables, Works for any draw game, 5-minute updates

12. "The Lottery Analyst" — GHS 150 / $13
    Data-driven number selection methodology guide. Selar link: [PLACEHOLDER]
    Features: Frequency analysis method, Wheeling system basics, Honest probability framing
```

---

## testimonials.js

```
Create /src/data/testimonials.js with 6 placeholder testimonials for Zylo Tech Solutions.
I will replace these with real ones later — make them realistic and results-focused.

Structure:
{
  id:      1,
  name:    "Pastor Emmanuel K.",
  role:    "Senior Pastor, Accra",
  product: "The Pastor's Admin Vault",
  rating:  5,
  text:    "Quote here — specific, results-focused, 2-3 sentences max."
}

Create one testimonial per category:
- 2 testimonials from pastors (ministry products) — Ghana and Nigeria names
- 2 testimonials from crypto traders — Ghana context, mention mobile money or GHS
- 1 testimonial from a programmer or developer
- 1 testimonial from a lottery enthusiast

Rules for the placeholder quotes:
- Sound like real people, not marketing copy
- Mention a specific benefit or time saved
- Use names realistic for Ghana and West Africa
- Keep each quote under 60 words
```

---

## posts.js — starter blog content

```
Create /src/data/posts.js with 6 blog posts for Zylo Tech Solutions.
Write real, useful 400-500 word content for each post. Do not use placeholder text.

Structure:
{
  id:       1,
  slug:     "url-friendly-slug-here",
  title:    "Full Post Title Here",
  excerpt:  "2-3 sentence summary shown in the blog list. Make it compelling.",
  date:     "2024-01-15",
  category: "Crypto Trading",  // Ministry | Crypto Trading | Programming | Lottery
  readTime: "6 min read",
  image:    "/images/blog-1.jpg",
  content:  `Full article content here.

Use double newlines to separate paragraphs.
Each \n\n becomes a new <p> tag in BlogPost.jsx.

Write in a warm, expert, practical tone.
Use subheadings by starting a line with ## (I will parse these later).`
}

Write these 6 posts:

1. "How to Start Trading Cryptocurrency Safely from Ghana" (Crypto Trading)
   Focus: P2P trading, mobile money on-ramps, avoiding scams, which local exchanges to use

2. "The 3 Things Every New Pastor Needs in Their First Year" (Ministry)
   Focus: administration systems, discipleship structure, avoiding burnout from day one

3. "How to Analyse Lottery Numbers with Data Instead of Luck" (Lottery)
   Focus: frequency tables, what hot and cold numbers actually mean, honest probability framing

4. "Build a Telegram Price Alert Bot in Python in 30 Minutes" (Programming)
   Focus: step-by-step guide using the Telegram Bot API and a free crypto price API

5. "How to Receive Crypto Payments in Your Ghana Business" (Crypto Trading)
   Focus: accepting Bitcoin and USDT, converting to cedis, invoicing, tax considerations

6. "Why Your Church Needs a Discipleship System, Not More Programs" (Ministry)
   Focus: difference between activity and growth, building a 4-stage pipeline, measuring maturity
```

---

---

# Section 6: Debugging Prompts

Paste any of these when you hit a problem during development.

---

## Tailwind classes not applying

```
My Tailwind CSS classes are not applying in my Vite React project.

Here is my current tailwind.config.js:
[paste your tailwind.config.js here]

Here is my index.css:
[paste your index.css here]

Please:
1. Check the content array includes all my JSX files
2. Check index.css has @tailwind base, components, utilities in the correct order
3. Check postcss.config.js is correctly set up with tailwindcss and autoprefixer
4. Tell me if I need to restart the dev server
5. Fix whatever is wrong and show me the corrected files
```

---

## React Router showing blank pages

```
My React Router routes are showing blank pages or the wrong component.

Here is my App.jsx:
[paste your App.jsx here]

Please:
1. Check Routes and Route are correctly imported from react-router-dom
2. Check BrowserRouter wraps everything at the root level
3. Check all path attributes use the correct format
4. Check all page components are imported with the correct file paths
5. Fix anything wrong and show me the corrected App.jsx
```

---

## EmailJS form not sending

```
My EmailJS contact form is not sending emails.

Here is my Contact.jsx:
[paste your Contact.jsx here]

My EmailJS config:
Service ID:  [your ID]
Template ID: [your ID]

Please:
1. Check the emailjs.sendForm() call syntax
2. Check the form ref is attached to the <form> element correctly
3. Check field names in the form match the template variables in EmailJS
4. Show me the exact template variables to set up at emailjs.com
5. Fix the component and show me the corrected Contact.jsx
```

---

## Mobile hamburger menu not working

```
My mobile hamburger menu in Navbar.jsx is not opening or closing correctly.

Here is my Navbar.jsx:
[paste your Navbar.jsx here]

Please:
1. Fix the useState toggle for the menu open/close state
2. Make sure clicking a nav link closes the menu
3. Make sure clicking outside the menu closes it (useEffect + click outside handler)
4. Fix any z-index issues hiding the menu behind other elements
5. Show me the corrected Navbar.jsx
```

---

## Vercel deployment failing

```
My Vercel deployment is failing. Here is the exact error from the build log:

[paste the exact error message from Vercel here]

My project: Vite + React
Build command: npm run build
Output directory: dist

Please:
1. Identify the exact cause from the error message
2. Tell me the exact file to fix and what change to make
3. If it is an import error, show the correct import statement
4. If it is a missing dependency, show the npm install command
5. Show me how to verify the fix works locally with npm run build before pushing again
```

---

## Page not scrolling to top on route change

```
When I navigate between pages in my React Router app, the page does not
scroll back to the top. It stays at the same scroll position from the previous page.

Here is my App.jsx:
[paste your App.jsx here]

Please:
1. Show me the ScrollToTop component using useEffect and useLocation from react-router-dom
2. Show me where to place it inside App.jsx (inside BrowserRouter, before Routes)
3. Show me the complete corrected App.jsx with ScrollToTop included
```

---

---

*Zylo Tech Solutions — Website Build Specification*
*6 sections | Every prompt you need | One website | Yours*
*Registered in Ghana | Built with Claude (Anthropic)*
