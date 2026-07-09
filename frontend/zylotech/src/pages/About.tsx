import { Link } from "react-router-dom";
import { BookOpen, Code, TrendingUp, ExternalLink } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { organizationSchema, breadcrumbSchema } from "../components/JsonLd";
import SectionHeader from "../components/SectionHeader";

const pillars = [
  {
    icon: BookOpen,
    title: "Ministry & Pastoral Work",
    color: "bg-teal text-white",
    iconBg: "bg-white/20",
    credentials: [
      "[PLACEHOLDER — e.g., Years in full-time pastoral ministry]",
      "[PLACEHOLDER — e.g., Churches planted or led]",
      "[PLACEHOLDER — e.g., Specific ministry training or ordination]",
    ],
  },
  {
    icon: Code,
    title: "Computer Programming",
    color: "bg-navy text-white",
    iconBg: "bg-white/20",
    credentials: [
      "[PLACEHOLDER — e.g., Languages and frameworks you work with]",
      "[PLACEHOLDER — e.g., Projects built or deployed]",
      "[PLACEHOLDER — e.g., How you learned to code]",
    ],
  },
  {
    icon: TrendingUp,
    title: "Cryptocurrency & Trading",
    color: "bg-gold text-white",
    iconBg: "bg-white/20",
    credentials: [
      "[PLACEHOLDER — e.g., Years of trading experience]",
      "[PLACEHOLDER — e.g., Markets or instruments you trade]",
      "[PLACEHOLDER — e.g., Trading methodology or philosophy]",
    ],
  },
];

const workWithMe = [
  {
    title: "Buy a Product",
    description: "Browse our full library of digital tools and guides.",
    link: "/products",
    internal: true,
    cta: "Browse Products",
  },
  {
    title: "Join the Community",
    description: "Connect with traders, builders, and ministers in our free Telegram group.",
    link: "https://t.me/PLACEHOLDER",
    internal: false,
    cta: "Join Telegram",
  },
  {
    title: "Book a 1-on-1 Session",
    description: "Work directly with us via a private coaching call on Calendly.",
    link: "#",
    internal: false,
    cta: "Book a Session",
  },
];

export default function About() {
  return (
    <>
      <SEOMeta
        title="About | Zylo Tech Solutions"
        description="Meet the team behind Zylo Tech Solutions — programmers, crypto traders, and community builders registered in Ghana and serving West Africa."
        keywords="about Zylo Tech, Ghana digital products, pastor programmer Ghana, Anthony Enchia, Emmanuel Obeng"
        canonical="/about"
      />
      <JsonLd schema={[
        organizationSchema,
        breadcrumbSchema([
          { name: "Home", url: "https://zylotech.com/" },
          { name: "About", url: "https://zylotech.com/about" },
        ]),
      ]} />

      {/* Hero About */}
      <section className="py-20 px-4 bg-gradient-to-br from-navy to-teal-dark">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Photo placeholder */}
          <div className="shrink-0">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-teal bg-teal-light flex items-center justify-center text-7xl">
              👤
            </div>
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
              Anthony Enchia & Emmanuel Obeng
            </h1>
            <p className="text-teal font-semibold text-lg mb-4">
              Programmers · Crypto Traders · Community Builders · Based in Ghana
            </p>
            <p className="text-white/80 leading-relaxed mb-6">
              [PLACEHOLDER — Add your 3-sentence personal introduction here. Who are you, what do you do, and why does it matter to the people you serve?]
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-teal/20 border border-teal/40 text-teal text-sm font-semibold px-4 py-1.5 rounded-full">
                🇬🇭 Ghana Registered Business
              </span>
              <span className="bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                Est. 2024
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Our Story" centered={false} />
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              [PLACEHOLDER — Paragraph 1: The beginning. Where did you start? What problem did you see that no one was solving? What made you want to build something?]
            </p>
            <p>
              [PLACEHOLDER — Paragraph 2: The journey. How did you combine ministry, programming, and trading? What have you learned along the way? What mistakes did you make that taught you the most?]
            </p>
            <p>
              [PLACEHOLDER — Paragraph 3: Why Zylo Tech Solutions. What gap does it fill? Who is it for? What do you want it to become? End with your mission statement in plain language.]
            </p>
          </div>
        </div>
      </section>

      {/* Three Expertise Pillars */}
      <section className="py-20 px-4 bg-[#F4F3EF]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="What We Know Best" subtitle="Three areas where we have spent years building real expertise." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className={`rounded-card p-8 ${pillar.color}`}>
                <div className={`w-12 h-12 rounded-full ${pillar.iconBg} flex items-center justify-center mb-5`}>
                  <pillar.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-5">{pillar.title}</h3>
                <ul className="space-y-3">
                  {pillar.credentials.map((c, i) => (
                    <li key={i} className="text-sm opacity-90 flex items-start gap-2">
                      <span className="mt-1 shrink-0">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ghana */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Why Ghana and West Africa?" centered={false} />
          <p className="text-gray-600 leading-relaxed mb-10 text-lg">
            Everything we build is priced in GHS, tested with mobile money, and written for the West African context.
            We know what it's like to trade crypto from Accra, build software with load-shedding interruptions, and lead
            a church without a big institutional budget. That context shapes every product we make.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Countries Served", value: "[#]" },
              { label: "Products Built", value: "12+" },
              { label: "Community Members", value: "[#]+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#F4F3EF] rounded-card p-6 text-center">
                <p className="font-heading text-4xl font-bold text-teal mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Me */}
      <section className="py-20 px-4 bg-navy">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Work With Us" subtitle="Pick the best way to get started." light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workWithMe.map((item) => (
              <div key={item.title} className="bg-white/10 border border-white/20 rounded-card p-7 text-center flex flex-col items-center gap-4">
                <h3 className="font-heading font-bold text-white text-xl">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
                {item.internal ? (
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-6 py-2.5 rounded-full hover:bg-teal-dark transition-colors"
                  >
                    {item.cta}
                  </Link>
                ) : (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-6 py-2.5 rounded-full hover:bg-teal-dark transition-colors"
                  >
                    {item.cta} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
