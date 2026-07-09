import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { MessageCircle, Mail, Send, ExternalLink, ChevronDown, ChevronUp, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import JsonLd, { breadcrumbSchema, faqSchema } from "../components/JsonLd";
import SectionHeader from "../components/SectionHeader";
import { EMAILJS_CONFIG } from "../config/emailjs";

interface FormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

const faqs = [
  {
    q: "How quickly will you reply?",
    a: "Within 24 hours on weekdays (Monday to Friday, 8am–6pm GMT). For urgent matters, WhatsApp is the fastest channel.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, within 7 days of purchase if the product does not deliver the value described. Contact us and we will process it promptly.",
  },
  {
    q: "Can I pay with mobile money?",
    a: "Yes. All products are sold via Selar.co which uses Paystack — supporting MTN MoMo, Vodafone Cash, AirtelTigo Money, and major cards.",
  },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const onSubmit = async () => {
    if (!formRef.current) return;
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        formRef.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      setIsSuccess(true);
      reset();
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOMeta
        title="Contact | Zylo Tech Solutions"
        description="Get in touch with Zylo Tech Solutions. Ask about products, book a 1-on-1 coaching session, or join the free community. Based in Accra, Ghana."
        keywords="contact Zylo Tech Ghana, coaching session Ghana, book session West Africa, digital products support"
        canonical="/contact"
      />
      <JsonLd schema={[
        breadcrumbSchema([
          { name: "Home", url: "https://zylotech.com/" },
          { name: "Contact", url: "https://zylotech.com/contact" },
        ]),
        faqSchema(faqs.map(f => ({ q: f.q, a: f.a }))),
      ]} />

      {/* Header */}
      <section className="bg-gradient-to-r from-navy to-teal-dark py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-white/80 text-lg">
            Whether you want to buy a product, book a session, or just ask a question — we read every message.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-20 px-4 bg-[#F4F3EF]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Contact Info */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy mb-2">Contact Info</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Whether you want to buy a product, book a coaching session, or have a question — we read every message.
            </p>

            <ul className="space-y-5 mb-8">
              <li>
                <a
                  href="https://wa.me/PLACEHOLDER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-teal transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-light rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">WhatsApp</p>
                    <p className="text-gray-400 text-xs">Chat with us directly</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@zylotech.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-teal transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-light rounded-full flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-gray-400 text-xs">hello@zylotech.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/PLACEHOLDER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-teal transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-light rounded-full flex items-center justify-center shrink-0">
                    <Send size={18} className="text-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Telegram Community</p>
                    <p className="text-gray-400 text-xs">Join our free group</p>
                  </div>
                </a>
              </li>
            </ul>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-6 py-3 rounded-full hover:bg-teal-dark transition-colors mb-8"
            >
              Book a 1-on-1 Session <ExternalLink size={15} />
            </a>

            <div className="text-sm text-gray-500 space-y-1">
              <p>🇬🇭 Based in Accra, Ghana</p>
              <p>Monday to Friday, 8am to 6pm GMT</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-card shadow-card p-8">
            <h2 className="font-heading text-xl font-bold text-navy mb-6">Send a Message</h2>

            {isSuccess && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-4 mb-6">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                Message sent! I will reply within 24 hours.
              </div>
            )}
            {isError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-4 mb-6">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                Something went wrong. Please try WhatsApp instead.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  {...register("from_name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors ${errors.from_name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  placeholder="Your full name"
                />
                {errors.from_name && <p className="text-red-500 text-xs mt-1">{errors.from_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  {...register("from_email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }
                  })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors ${errors.from_email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  placeholder="you@example.com"
                />
                {errors.from_email && <p className="text-red-500 text-xs mt-1">{errors.from_email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                <select
                  {...register("subject", { required: "Please select a subject" })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors bg-white ${errors.subject ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                >
                  <option value="">Select a subject...</option>
                  <option value="Product question">Product question</option>
                  <option value="Coaching inquiry">Coaching inquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Technical support">Technical support</option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 20, message: "Message must be at least 20 characters" }
                  })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  placeholder="Tell us how we can help..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal text-white font-bold py-3 rounded-lg hover:bg-teal-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Quick Answers" centered />
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
