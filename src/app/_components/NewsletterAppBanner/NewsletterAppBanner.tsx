"use client";

import React, { useState } from "react";
import {
  Mail,
  Leaf,
  Truck,
  Tag,
  ArrowRight,
  Star,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function NewsletterAppBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3500);
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 py-8 mb-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f3fbf6] via-white to-[#eefaf3] border border-[#dcfce7]/90 p-6 sm:p-10 lg:p-12 shadow-[0_8px_32px_rgba(16,185,129,0.06)]">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* ── Left Column: Newsletter Subscription ── */}
          <div className="lg:col-span-7">
            {/* Top Newsletter Badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-[#16a34a]/25 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#16a34a]">
                  NEWSLETTER
                </span>
                <span className="block text-xs text-[#64748b]">
                  50,000+ subscribers
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0f172a] tracking-tight leading-tight mb-2.5">
              Get the Freshest Updates{" "}
              <span className="text-[#16a34a]">Delivered Free</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#64748b] mb-6">
              Weekly recipes, seasonal offers &amp; exclusive member perks.
            </p>

            {/* 3 Feature Pills */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 mb-7">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200/80 rounded-full pl-2 pr-3.5 py-1.5 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-[#334155]">
                  Fresh Picks Weekly
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-white border border-gray-200/80 rounded-full pl-2 pr-3.5 py-1.5 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-[#334155]">
                  Free Delivery Codes
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-white border border-gray-200/80 rounded-full pl-2 pr-3.5 py-1.5 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-[#334155]">
                  Members-Only Deals
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#1e293b] placeholder:text-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-3 focus:ring-[#16a34a]/15 shadow-2xs"
              />
              <button
                type="submit"
                className="h-12 px-7 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-[#16a34a]/20 transition-all cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {subscribed ? (
              <p className="text-xs font-semibold text-[#16a34a] mt-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing to FreshCart updates!</span>
              </p>
            ) : (
              <p className="text-[11px] text-[#94a3b8] mt-3 flex items-center gap-1.5">
                <span className="text-amber-400">✨</span>
                <span>Unsubscribe anytime. No spam, ever.</span>
              </p>
            )}
          </div>

          {/* ── Right Column: Mobile App Promo Dark Card ── */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#131d2e] to-[#0f2928] p-6 sm:p-8 text-white shadow-xl">
              {/* Green Glow inside Dark Card */}
              <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#10b981]/25 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Mobile App Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] text-[10px] font-extrabold uppercase tracking-wider mb-4">
                  <Smartphone className="w-3 h-3" />
                  <span>MOBILE APP</span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5">
                  Shop Faster on Our App
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-6">
                  Get app-exclusive deals &amp; 15% off your first order.
                </p>

                {/* Store Buttons */}
                <div className="space-y-3 mb-5">
                  {/* App Store Button */}
                  <a
                    href="#app-store"
                    onClick={(e) => e.preventDefault()}
                    className="w-full rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 px-4 py-3 flex items-center gap-3.5 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-white shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3z" />
                    </svg>
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400 leading-none mb-1">
                        DOWNLOAD ON
                      </span>
                      <span className="block text-sm font-bold text-white leading-none">
                        App Store
                      </span>
                    </div>
                  </a>

                  {/* Google Play Button */}
                  <a
                    href="#google-play"
                    onClick={(e) => e.preventDefault()}
                    className="w-full rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 px-4 py-3 flex items-center gap-3.5 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-white shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
                    </svg>
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400 leading-none mb-1">
                        GET IT ON
                      </span>
                      <span className="block text-sm font-bold text-white leading-none">
                        Google Play
                      </span>
                    </div>
                  </a>
                </div>

                {/* Rating & Downloads Footer */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    4.9 · 100K+ downloads
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
