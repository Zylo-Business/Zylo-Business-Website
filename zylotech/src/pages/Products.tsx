import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { productSchema, faqSchema, breadcrumbSchema } from "../components/JsonLd";
import SectionHeader from "../components/SectionHeader";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import type { Product } from "../data/products";

type Category = "all" | "ministry" | "crypto" | "programming" | "lottery";

const tabs: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Ministry & Church", value: "ministry" },
  { label: "Cryptocurrency & Trading", value: "crypto" },
  { label: "Programming & Tech", value: "programming" },
  { label: "Lottery & Forecasting", value: "lottery" },
];

const faqs = [
  {
    q: "How do I receive my product?",
    a: "You'll receive an instant download link sent directly to your email after purchase is confirmed on Selar.co.",
  },
  {
    q: "Can I pay with mobile money?",
    a: "Yes. Selar.co uses Paystack which supports MTN MoMo, Vodafone Cash, AirtelTigo Money, and major debit/credit cards.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, within 7 days of purchase if the product does not deliver the value described. Contact us via WhatsApp or email.",
  },
  {
    q: "Do you offer coaching?",
    a: "Yes. Book a 1-on-1 coaching session via the Contact page and we'll schedule a call based on your needs.",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-card shadow-card p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-3" />
      <div className="h-16 bg-gray-200 rounded mb-4" />
      <div className="space-y-2 mb-5">
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
        <div className="h-4 bg-gray-200 rounded w-3/6" />
      </div>
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as Category) || "all";

  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [filtered, setFiltered] = useState<Product[]>(products);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFiltered(
        activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)
      );
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <>
      <SEOMeta
        title="Products | Zylo Tech Solutions"
        description="Browse all digital products for pastors, crypto traders, programmers, and lottery enthusiasts in Ghana and West Africa. Priced in GHS, instant download."
        keywords="digital products Ghana, crypto course Ghana, pastor tools Africa, python scripts Ghana, lottery analysis spreadsheet"
        canonical="/products"
      />
      <JsonLd schema={[
        breadcrumbSchema([
          { name: "Home", url: "https://zylotech.com/" },
          { name: "Products", url: "https://zylotech.com/products" },
        ]),
        ...products.map(p => productSchema(p)),
        faqSchema(faqs.map(f => ({ q: f.q, a: f.a }))),
      ]} />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-navy to-teal-dark py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            All Products
          </h1>
          <p className="text-white/80 text-lg">
            Practical tools, courses, and guides — priced in GHS, delivered instantly.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2 py-3 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === tab.value
                    ? "bg-teal text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-teal-light hover:text-teal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 bg-[#F4F3EF] min-h-[400px]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-2">No products in this category yet.</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="text-teal font-semibold hover:underline"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Frequently Asked Questions" centered />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-navy hover:bg-gray-50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} className="text-teal shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
