import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Product } from "../data/products";

const categoryColors: Record<string, string> = {
  ministry: "bg-teal-light text-teal-dark",
  crypto: "bg-purple-100 text-purple-800",
  programming: "bg-amber-100 text-amber-800",
  lottery: "bg-green-100 text-green-800",
};

const categoryLabels: Record<string, string> = {
  ministry: "Ministry & Church",
  crypto: "Crypto & Trading",
  programming: "Programming",
  lottery: "Lottery & Forecasting",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = () => {
    setLoading(true);
    setTimeout(() => {
      window.open(product.selarLink, "_blank");
      setLoading(false);
    }, 400);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-card shadow-card hover:border-teal hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden">
      {/* Ribbon */}
      {product.badge && (
        <div className="absolute top-3 right-3 bg-teal text-white text-xs font-bold px-2 py-1 rounded-badge z-10">
          {product.badge}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-badge mb-3 w-fit ${categoryColors[product.category]}`}>
          {categoryLabels[product.category]}
        </span>

        {/* Title */}
        <h3 className="font-heading font-bold text-navy text-lg leading-snug line-clamp-2 mb-3">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-teal font-bold text-2xl">{product.price}</span>
          <span className="text-gray-400 text-sm">({product.usdPrice})</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{product.description}</p>

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <Check size={15} className="text-teal mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Buy button */}
        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-teal text-white font-semibold py-2.5 rounded-lg hover:bg-teal-dark transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Opening...
            </>
          ) : (
            "Buy Now"
          )}
        </button>

        <button
          onClick={() => console.log("Learn more:", product.title)}
          className="mt-2 text-sm text-teal hover:underline text-center"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
