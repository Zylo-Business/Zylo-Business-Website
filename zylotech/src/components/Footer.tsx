import { Link } from "react-router-dom";
import { Globe, AtSign, Send, CirclePlay, Briefcase, MessageCircle, Mail, ArrowRight } from "lucide-react";
import { whatsappUrl } from "../lib/contact";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-12 border-b border-line">
          <div>
            <h3 className="font-heading text-2xl font-bold text-ink tracking-tight">
              Get free ministry &amp; trading tips every week
            </h3>
            <p className="text-muted mt-1">Practical insights for Ghana's builders — straight to your inbox.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 md:w-64 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="group inline-flex items-center gap-1.5 bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-teal transition-colors whitespace-nowrap"
            >
              Subscribe
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-lg text-ink mb-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-teal text-white text-sm font-bold">
                Z
              </span>
              Zylo<span className="text-teal -ml-1">Tech</span>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-5 max-w-xs">
              Digital products for Ghana's builders, traders, and ministers.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: "#", label: "Facebook" },
                { icon: AtSign, href: "#", label: "Twitter" },
                { icon: Send, href: "#", label: "Telegram" },
                { icon: CirclePlay, href: "#", label: "YouTube" },
                { icon: Briefcase, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid place-items-center w-9 h-9 rounded-full border border-line bg-white text-muted hover:text-teal hover:border-teal transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-ink mb-4 text-sm">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                { label: "About", to: "/about" },
                { label: "Blog", to: "/blog" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted text-sm hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-ink mb-4 text-sm">Products</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Ministry Tools", category: "ministry" },
                { label: "Crypto Products", category: "crypto" },
                { label: "Programming Tools", category: "programming" },
                { label: "Lottery Analysis", category: "lottery" },
              ].map((item) => (
                <li key={item.category}>
                  <Link
                    to={`/products?category=${item.category}`}
                    className="text-muted text-sm hover:text-ink transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-ink mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 text-muted text-sm hover:text-ink transition-colors"
                >
                  <MessageCircle size={15} /> WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@zylotech.com"
                  className="flex items-center gap-2 text-muted text-sm hover:text-ink transition-colors"
                >
                  <Mail size={15} /> hello@zylotech.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted text-sm hover:text-ink transition-colors"
                >
                  <Send size={15} /> Telegram community
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-8 border-t border-line text-sm text-muted">
          <p>© {year} Zylo Tech Solutions. Registered in Ghana. All rights reserved.</p>
          <p>Built with Claude AI</p>
        </div>
      </div>
    </footer>
  );
}
