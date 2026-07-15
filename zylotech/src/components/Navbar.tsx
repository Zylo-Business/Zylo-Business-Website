import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-line"
          : "bg-white/0 border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg text-ink">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-teal text-white text-sm font-bold shadow-glow">
              Z
            </span>
            <span>
              Zylo<span className="text-teal">Tech</span>
            </span>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm rounded-full transition-colors duration-200 ${
                    isActive
                      ? "text-ink font-semibold bg-canvas"
                      : "text-muted hover:text-ink hover:bg-canvas"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/products"
              className="group inline-flex items-center gap-1.5 bg-ink text-white text-sm font-semibold pl-4 pr-3.5 py-2 rounded-full hover:bg-teal transition-colors duration-200"
            >
              Get products
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-ink"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-line shadow-soft">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? "bg-canvas text-ink font-semibold" : "text-muted hover:bg-canvas"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-ink text-white text-sm font-semibold px-4 py-2.5 rounded-full text-center hover:bg-teal transition-colors"
            >
              Get products
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
