import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MessageCircle } from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import LotteryTracker from "./pages/LotteryTracker";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-teal mb-4">404</h1>
      <p className="text-xl text-navy font-semibold mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-teal text-white font-semibold px-6 py-3 rounded-full hover:bg-teal-dark transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lottery-tracker" element={<LotteryTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/PLACEHOLDER"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-teal text-white rounded-full w-14 h-14 flex items-center justify-center shadow-glow hover:bg-teal-dark hover:scale-105 transition-all duration-200"
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
