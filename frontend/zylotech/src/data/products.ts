export interface Product {
  id: number;
  title: string;
  category: "ministry" | "crypto" | "programming" | "lottery";
  price: string;
  usdPrice: string;
  description: string;
  features: string[];
  selarLink: string;
  badge?: "Best Seller" | "New" | "Popular";
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "The Pastor's Admin Vault",
    category: "ministry",
    price: "GHS 200",
    usdPrice: "$18",
    description:
      "20 ready-to-use church administration templates covering everything from membership registers to board minutes. Designed for Ghanaian and West African churches of any size.",
    features: ["20 ready-to-use templates", "Instant download", "Works for any church size"],
    selarLink: "https://selar.co/PLACEHOLDER-1",
    badge: "Best Seller",
    image: "/images/product-1.jpg",
  },
  {
    id: 2,
    title: "Preach That Moves",
    category: "ministry",
    price: "GHS 250",
    usdPrice: "$22",
    description:
      "A 7-step sermon construction guide for non-seminary ministers. Learn how to build messages that connect with your congregation and drive real transformation.",
    features: ["7-step framework", "Sermon diagnosis tools", "Works for any text or topic"],
    selarLink: "https://selar.co/PLACEHOLDER-2",
    image: "/images/product-2.jpg",
  },
  {
    id: 3,
    title: "The Discipleship Pipeline",
    category: "ministry",
    price: "GHS 350",
    usdPrice: "$30",
    description:
      "A complete discipleship system that takes church members from first visit to mature faith. Includes a 4-stage pathway with ready-made materials for any size church.",
    features: ["4-stage pathway", "Ready-made materials", "Plug-and-play for any church"],
    selarLink: "https://selar.co/PLACEHOLDER-3",
    badge: "New",
    image: "/images/product-3.jpg",
  },
  {
    id: 4,
    title: "The Caring Pastor",
    category: "ministry",
    price: "GHS 300",
    usdPrice: "$26",
    description:
      "A biblical counselling course for ministry leaders. Six video lessons covering how to walk alongside people through grief, marriage challenges, and spiritual crisis.",
    features: ["6 video lessons", "Counselling scripts", "When to refer guide"],
    selarLink: "https://selar.co/PLACEHOLDER-4",
    image: "/images/product-4.jpg",
  },
  {
    id: 5,
    title: "Closer: 30-Day Prayer Journal",
    category: "ministry",
    price: "GHS 150",
    usdPrice: "$13",
    description:
      "A grace-based daily prayer journal with 30 devotionals rooted in Scripture. Perfect for personal use or distributing to your congregation as a discipleship resource.",
    features: ["30 daily devotionals", "Scripture + reflection + prayer", "Printable PDF"],
    selarLink: "https://selar.co/PLACEHOLDER-5",
    image: "/images/product-5.jpg",
  },
  {
    id: 6,
    title: "Ghana Crypto Starter Blueprint",
    category: "crypto",
    price: "GHS 200",
    usdPrice: "$18",
    description:
      "Your complete guide to buying, trading, and storing Bitcoin safely from Ghana using mobile money. Covers local exchanges, P2P safety, and avoiding the most common scams.",
    features: ["Mobile money on-ramp guide", "Local exchange comparison", "P2P safety rules"],
    selarLink: "https://selar.co/PLACEHOLDER-6",
    badge: "Best Seller",
    image: "/images/product-6.jpg",
  },
  {
    id: 7,
    title: "The Drawdown Shield",
    category: "crypto",
    price: "GHS 300",
    usdPrice: "$26",
    description:
      "A crypto risk management system built into a Google Sheets spreadsheet. Automatically enforces your position sizing and drawdown rules so emotions never cost you money again.",
    features: ["Position sizing calculator", "Drawdown tracker", "Risk rules enforced automatically"],
    selarLink: "https://selar.co/PLACEHOLDER-7",
    image: "/images/product-7.jpg",
  },
  {
    id: 8,
    title: "Passive Crypto Income Playbook",
    category: "crypto",
    price: "GHS 350",
    usdPrice: "$30",
    description:
      "Five passive income methods using staking, DeFi, and yield strategies that work safely from West Africa. Step-by-step guides for platforms accessible with mobile money.",
    features: ["5 passive income methods", "West Africa safe platforms", "Step-by-step guides"],
    selarLink: "https://selar.co/PLACEHOLDER-8",
    image: "/images/product-8.jpg",
  },
  {
    id: 9,
    title: "The Zylo Trading Script Pack",
    category: "programming",
    price: "GHS 500",
    usdPrice: "$44",
    description:
      "Ten ready-to-run Python scripts for crypto price alerts, strategy backtesting, and portfolio tracking. All scripts include full documentation and work with free APIs.",
    features: ["10 working scripts", "Full documentation", "Works with free APIs"],
    selarLink: "https://selar.co/PLACEHOLDER-9",
    badge: "Popular",
    image: "/images/product-9.jpg",
  },
  {
    id: 10,
    title: "Python for Traders",
    category: "programming",
    price: "GHS 600",
    usdPrice: "$52",
    description:
      "Automate your trading strategy in 5 hands-on sessions. Build a real Telegram alert bot from scratch — no prior coding experience required.",
    features: ["5 video sessions", "Build a Telegram alert bot", "No prior coding required"],
    selarLink: "https://selar.co/PLACEHOLDER-10",
    image: "/images/product-10.jpg",
  },
  {
    id: 11,
    title: "LottoScan Pro Spreadsheet",
    category: "lottery",
    price: "GHS 180",
    usdPrice: "$16",
    description:
      "A frequency analysis tool that auto-generates hot and cold number tables for any lottery game. Update it in 5 minutes after each draw.",
    features: ["Auto-generates frequency tables", "Works for any draw game", "5-minute updates"],
    selarLink: "https://selar.co/PLACEHOLDER-11",
    image: "/images/product-11.jpg",
  },
  {
    id: 12,
    title: "The Lottery Analyst",
    category: "lottery",
    price: "GHS 150",
    usdPrice: "$13",
    description:
      "A data-driven number selection methodology guide. Covers frequency analysis, wheeling system basics, and an honest framing of what data can and cannot tell you about probability.",
    features: ["Frequency analysis method", "Wheeling system basics", "Honest probability framing"],
    selarLink: "https://selar.co/PLACEHOLDER-12",
    image: "/images/product-12.jpg",
  },
];

export default products;
