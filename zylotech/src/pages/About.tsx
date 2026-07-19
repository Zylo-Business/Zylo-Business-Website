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
      "We've served in real congregations — we know pastoral work from the inside, not from a textbook.",
      "Every ministry product is battle-tested in live ministry, not written from theory.",
      "Admin systems, discipleship pipelines, and sermon tools built to give pastors their time back.",
    ],
  },
  {
    icon: Code,
    title: "Computer Programming",
    color: "bg-navy text-white",
    iconBg: "bg-white/20",
    credentials: [
      "Full-stack builders shipping real software — including the site and tools you're using right now.",
      "We write Python that beginners and traders can actually run, documented so it assumes nothing.",
      "Self-taught ourselves, so we teach the way we wish we'd been taught: practical first, jargon last.",
    ],
  },
  {
    icon: TrendingUp,
    title: "Cryptocurrency & Trading",
    color: "bg-gold text-white",
    iconBg: "bg-white/20",
    credentials: [
      "Active traders in West African markets — we put our own capital on the line, not just opinions.",
      "Risk-first methodology: we teach you to survive drawdowns before you ever chase gains.",
      "Everything tested from Accra — mobile money, local exchanges, and real-world friction included.",
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
        description="Meet the team behind Zylo Tech Solutions — programmers, crypto traders, and ministry builders registered in Ghana and building digital tools for West Africa."
        keywords="about Zylo Tech, Ghana digital products, pastor programmer Ghana, West Africa crypto tools, Python for traders Ghana, mobile money digital products"
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
          {/* Team mark */}
          <div className="shrink-0">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-teal bg-teal-light flex items-center justify-center text-7xl">
              👥
            </div>
          </div>
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-3">
              We Are Zylo Tech Solutions
            </h1>
            <p className="text-teal font-semibold text-lg mb-4">
              Builders · Traders · Ministers · Based in Ghana, Serving West Africa
            </p>
            <p className="text-white/80 leading-relaxed mb-6">
              We're a Ghana-based team of programmers, crypto traders, and ministry leaders who got tired of
              watching West Africans pay for foreign tools that were never built for how we actually work, get
              paid, or worship. So we build our own — practical digital products, priced in cedis and delivered
              straight to your phone, designed to give you an unfair advantage in your calling, your trading, and
              your craft.
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
              It started with the people we serve. Pastors carrying whole congregations on their shoulders with
              nothing but a notebook. Traders risking their savings on gut feeling because no one ever taught
              them the rules. Young people teaching themselves to code with slow internet and no one to ask. We
              kept meeting the same hardworking people held back by the same thing: no tools built for them.
            </p>
            <p>
              So we started building — and our community showed us exactly what to build next. Every product
              here came from a real conversation with a real client: the admin system a pastor begged us for,
              the risk rules a trader wished he'd had before his worst week, the scripts a beginner needed to
              land his first project. We listened, we built, they told us where we got it wrong, and we made it
              better. That loop is the whole company.
            </p>
            <p>
              Today Zylo Tech Solutions is a registered Ghanaian business and a growing community of over 100
              members across two countries — pastors, traders, coders, and everyday people who just want tools
              that respect their money and their context. Our mission is simple: build for the people right in
              front of us, price it for how they actually get paid, and make it so good they bring the next
              person with them.
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
              { label: "Countries Served", value: "2" },
              { label: "Products Built", value: "12+" },
              { label: "Community Members", value: "100+" },
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
