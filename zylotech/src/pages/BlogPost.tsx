import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { articleSchema, breadcrumbSchema } from "../components/JsonLd";
import posts from "../data/posts";

const categoryColors: Record<string, string> = {
  "Ministry": "bg-teal-light text-teal-dark",
  "Crypto Trading": "bg-purple-100 text-purple-800",
  "Programming": "bg-amber-100 text-amber-800",
  "Lottery": "bg-green-100 text-green-800",
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">📄</p>
        <h1 className="font-heading text-2xl font-bold text-navy mb-2">Post Not Found</h1>
        <p className="text-gray-500 mb-6">This article doesn't exist or may have been removed.</p>
        <Link to="/blog" className="flex items-center gap-2 text-teal font-semibold hover:underline">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);
  const badgeClass = categoryColors[post.category] || "bg-gray-100 text-gray-700";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappText = encodeURIComponent(`${post.title} — ${shareUrl}`);

  const paragraphs = post.content
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      <SEOMeta
        title={`${post.title} | Zylo Tech Blog`}
        description={post.excerpt}
        keywords={`${post.category} Ghana, ${post.category} West Africa, Zylo Tech blog`}
        canonical={`/blog/${post.slug}`}
        type="article"
      />
      <JsonLd schema={[
        articleSchema(post),
        breadcrumbSchema([
          { name: "Home", url: "https://zylotechhub.com/" },
          { name: "Blog", url: "https://zylotechhub.com/blog" },
          { name: post.title, url: `https://zylotechhub.com/blog/${post.slug}` },
        ]),
      ]} />

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <article className="flex-1 min-w-0">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-teal text-sm font-semibold hover:underline mb-8">
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {/* Category + meta */}
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-badge mb-4 ${badgeClass}`}>
            {post.category}
          </span>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200">
            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-5">
            {paragraphs.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-heading text-xl font-bold text-navy mt-8 mb-2">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Share + Back */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to="/blog" className="inline-flex items-center gap-2 text-teal font-semibold hover:underline">
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors"
            >
              <Share2 size={15} /> Share on WhatsApp
            </a>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-[#F4F3EF] rounded-card p-6">
              <h3 className="font-heading font-bold text-navy text-lg mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="block group">
                    <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors leading-snug">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{p.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Email Signup */}
          <div className="bg-teal rounded-card p-6 text-white">
            <h3 className="font-heading font-bold text-lg mb-2">Get More Like This</h3>
            <p className="text-white/80 text-sm mb-4">
              Free weekly tips on trading, ministry, and programming in Ghana.
            </p>
            {/* MAILCHIMP FORM HERE */}
            <p className="text-white/50 text-xs italic">Email signup coming soon.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
