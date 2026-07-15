import { Star } from "lucide-react";
import type { Testimonial } from "../data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-card shadow-card p-6 flex flex-col gap-4">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? "text-gold fill-gold" : "text-gray-300"}
          />
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed italic">"{testimonial.text}"</p>
      <div className="mt-auto">
        <p className="font-semibold text-navy text-sm">{testimonial.name}</p>
        <p className="text-gray-400 text-xs">{testimonial.role}</p>
        <p className="text-teal text-xs mt-0.5">{testimonial.product}</p>
      </div>
    </div>
  );
}
