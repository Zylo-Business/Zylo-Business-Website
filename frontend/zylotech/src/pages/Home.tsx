import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Code2,
  Ticket,
  Smartphone,
  Download,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { organizationSchema, webSiteSchema, faqSchema } from "../components/JsonLd";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import products from "../data/products";
import testimonials from "../data/testimonials";

const homeFaqs = [
  {
    q: "What kinds of digital products does Zylo Tech Solutions sell?",
    a: "We build digital products for pastors and church leaders (admin templates, discipleship systems, sermon guides), cryptocurrency traders in West Africa (starter guides, risk tools, passive income playbooks), self-taught programmers (Python scripts and video courses), and lottery enthusiasts (data-driven analysis tools).",
  },
  {
    q: "How do I purchase and receive a product?",
    a: "Everything is sold through Selar.co. Tap Buy Now, pay with mobile money (MTN MoMo, Telecel Cash, AirtelTigo) or a debit card via Paystack, and an instant download link lands in your inbox — usually within seconds.",
  },
  {
    q: "Are products priced in Ghana cedis?",
    a: "Yes. Every product is priced in GHS with a USD equivalent shown for reference, and payment is processed by Paystack which fully supports Ghana mobile money.",
  },
  {
    q: "Who is this actually for?",
    a: "Anyone building something real in Ghana and West Africa — ministers running a church, traders learning crypto safely, developers leveling up in Python, and analysts who want data instead of luck.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Ministry & Church",
    description:
      "Admin templates, discipleship systems, and sermon frameworks built for the African church context.",
    tags: ["Admin vault", "Sermon guides", "Discipleship"],
    accent: "text-teal",
    chip: "bg-teal-light text-teal-dark",
  },
  {
    icon: TrendingUp,
    title: "Crypto & Trading",
    description:
      "Buy Bitcoin with mobile money, manage risk, and earn passive income — the safe West-Africa way.",
    tags: ["MoMo on-ramp", "Risk tools", "Passive income"],
    accent: "text-purple-700",
    chip: "bg-purple-100 text-purple-800",
  },
  {
    icon: Code2,
    title: "Programming",
    description:
      "Ready-to-run Python scripts, trading bots, and courses that take you from zero to shipping.",
    tags: ["Python scripts", "Telegram bots", "Video courses"],
    accent: "text-amber-700",
    chip: "bg-amber-100 text-amber-800",
  },
  {
    icon: Ticket,
    title: "Lottery & Forecasting",
    description:
      "Frequency-analysis spreadsheets and honest methodology — data-driven number selection, no hype.",
    tags: ["Frequency tables", "Spreadsheets", "Honest odds"],
    accent: "text-green-700",
    chip: "bg-green-100 text-green-800",
  },
];

const steps = [
  {
    icon: Sparkles,
    title: "Pick your product",
    description: "Browse 12 focused products across ministry, crypto, programming, and lottery.",
  },
  {
    icon: Smartphone,
    title: "Pay with Mobile Money",
    description: "Checkout on Selar with MTN MoMo, Telecel Cash, AirtelTigo, or a card via Paystack.",
  },
  {
    icon: Download,
    title: "Get it instantly",
    description: "Your download link arrives by email in seconds. Start using it the same day.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-canvas transition-colors"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-ink">{q}</span>
        <span className="shrink-0 grid place-items-center w-7 h-7 rounded-full bg-canvas text-ink">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && <p className="px-5 pb-5 -mt-1 text-muted text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Home() {
  const featuredProducts = products.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      <SEOMeta
        title="Zylo Tech Solutions | Digital Products for Ghana"
        description="Practical digital products for pastors, crypto traders, and programmers in Ghana and West Africa. Priced in GHS, delivered instantly via Selar.co."
        canonical="/"
      />
      <JsonLd schema={[organizationSchema, webSiteSchema, faqSchema(homeFaqs)]} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 hero-glow" />
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-20 md:pt-28 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-muted mb-7 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Registered in Ghana · 500+ builders served
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ink leading-[1.05] tracking-tight mb-6">
            Practical digital products for
            <br className="hidden sm:block" />{" "}
            <span className="text-teal">Africa's builders</span>, traders &amp; ministers.
          </h1>

          <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-9">
            We're programmers, crypto traders, and community builders based in Ghana — shipping tools,
            courses, and guides that solve real problems for real people. Priced in cedis, delivered
            instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 bg-ink text-white font-semibold px-6 py-3.5 rounded-full hover:bg-teal transition-colors text-base"
            >
              Browse all products
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://t.me/PLACEHOLDER"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-line bg-white text-ink font-semibold px-6 py-3.5 rounded-full hover:bg-canvas transition-colors text-base"
            >
              Join free community
            </a>
          </div>

          {/* mini trust row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-teal" /> 7-day value guarantee
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Smartphone size={16} className="text-teal" /> Pay with Mobile Money
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download size={16} className="text-teal" /> Instant download
            </span>
          </div>
        </div>
      </section>

      {/* ================= STAT / TRUST STRIP ================= */}
      <section className="border-y border-line bg-canvas">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Students & buyers" },
            { value: "12", label: "Focused products" },
            { value: "4", label: "Areas of expertise" },
            { value: "GHS", label: "Local, cedi pricing" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-ink">{s.value}</p>
              <p className="text-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES (BENTO) ================= */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-teal font-semibold text-sm uppercase tracking-wider mb-3">
              One studio, four lanes
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
              Everything we build is made for a specific person with a specific problem.
            </h2>
            <p className="text-muted text-lg">
              No fluff, no filler — just tools you can put to work the day you buy them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-3xl border border-line bg-white p-7 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`inline-grid place-items-center w-12 h-12 rounded-2xl bg-canvas mb-5 ${f.accent}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-heading text-xl font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-muted leading-relaxed mb-5">{f.description}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.chip}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 md:py-24 px-4 bg-canvas border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
              From tap to download in under a minute
            </h2>
            <p className="text-muted text-lg">
              No accounts to create, no waiting around. Buy it, and it's yours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="relative bg-white border border-line rounded-3xl p-7">
                <span className="absolute top-6 right-6 font-heading text-sm font-bold text-line">
                  0{i + 1}
                </span>
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-teal/10 text-teal mb-5">
                  <step.icon size={22} />
                </div>
                <h3 className="font-heading text-lg font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink tracking-tight mb-3">
                Best-selling products
              </h2>
              <p className="text-muted text-lg">
                Tools and courses built for Ghana and West Africa — priced in GHS, delivered instantly.
              </p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-1.5 text-ink font-semibold whitespace-nowrap hover:text-teal transition-colors"
            >
              View all 12
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 md:py-24 px-4 bg-canvas border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-gold fill-gold" />
              ))}
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
              Loved by builders across West Africa
            </h2>
            <p className="text-muted text-lg">Real results from real people — pastors, traders, and developers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTestimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted text-lg">Everything you need to know before you buy.</p>
          </div>
          <div className="space-y-3">
            {homeFaqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 pb-24">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-ink px-6 py-16 md:py-20 text-center">
          <div className="absolute inset-0 hero-glow opacity-60" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-teal/20 blur-3xl" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to learn from builders who live where you do?
            </h2>
            <p className="text-white/70 text-lg mb-9">
              Every product is built in Ghana, priced in cedis, and made for West Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-semibold px-7 py-3.5 rounded-full hover:bg-teal-dark transition-colors text-base"
              >
                Browse all products
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-base"
              >
                Meet the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
