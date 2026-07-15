import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { breadcrumbSchema, articleSchema } from "../components/JsonLd";
import SectionHeader from "../components/SectionHeader";
import BlogCard from "../components/BlogCard";
import posts from "../data/posts";

const categories = ["All", "Ministry", "Crypto Trading", "Programming", "Lottery"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <SEOMeta
        title="Blog | Zylo Tech Solutions"
        description="Free articles on crypto trading in Ghana, ministry leadership, Python programming, and lottery analysis — written by practitioners based in Accra."
        keywords="Ghana crypto blog, pastor resources Africa, python tutorial Ghana, lottery analysis Africa, West Africa trading tips"
        canonical="/blog"
      />
      <JsonLd schema={[
        breadcrumbSchema([
          { name: "Home", url: "https://zylotech.com/" },
          { name: "Blog", url: "https://zylotech.com/blog" },
        ]),
        ...posts.map(articleSchema),
      ]} />

      {/* Header */}
      <section className="bg-gradient-to-r from-navy to-teal-dark py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">The Zylo Blog</h1>
          <p className="text-white/80 text-lg">
            Free practical content on trading, ministry, programming, and more.
          </p>
        </div>
      </section>

      {/* Filter + Search Bar */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 min-w-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-teal text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-teal-light hover:text-teal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-teal transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-4 bg-[#F4F3EF] min-h-[400px]">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-2">No articles match your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-teal font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-6">
                  <SectionHeader title="Featured Article" centered={false} />
                  <div className="grid">
                    <BlogCard post={featured} featured />
                  </div>
                </div>
              )}
              {rest.length > 0 && (
                <div>
                  <SectionHeader title="More Articles" centered={false} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rest.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
