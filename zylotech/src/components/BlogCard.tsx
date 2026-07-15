import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { Post } from "../data/posts";

const categoryColors: Record<string, string> = {
  "Ministry": "bg-teal-light text-teal-dark",
  "Crypto Trading": "bg-purple-100 text-purple-800",
  "Programming": "bg-amber-100 text-amber-800",
  "Lottery": "bg-green-100 text-green-800",
};

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const badgeClass = categoryColors[post.category] || "bg-gray-100 text-gray-700";

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} className="group block bg-white border border-gray-200 rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden col-span-full">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 aspect-video md:aspect-auto flex items-center justify-center">
            <div className="w-full h-48 md:h-full bg-gradient-to-br from-teal-light to-navy-light flex items-center justify-center">
              <span className="text-6xl opacity-20">📝</span>
            </div>
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-badge mb-3 w-fit ${badgeClass}`}>
              {post.category}
            </span>
            <h3 className="font-heading font-bold text-navy text-xl md:text-2xl leading-snug mb-3 group-hover:text-teal transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
            </div>
            <span className="flex items-center gap-1 text-teal text-sm font-semibold group-hover:gap-2 transition-all">
              Read Article <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group block bg-white border border-gray-200 rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-teal-light to-navy-light flex items-center justify-center">
        <span className="text-5xl opacity-20">📝</span>
      </div>
      <div className="p-5">
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-badge mb-3 w-fit ${badgeClass}`}>
          {post.category}
        </span>
        <h3 className="font-heading font-bold text-navy text-base leading-snug mb-2 line-clamp-2 group-hover:text-teal transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
        </div>
        <span className="flex items-center gap-1 text-teal text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
          Read Article <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
