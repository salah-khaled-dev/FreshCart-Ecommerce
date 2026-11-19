import React from "react";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  SearchX,
  ArrowRight,
  Layers,
  Award,
  Heart,
  ShoppingCart,
} from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    { name: "All Categories", href: "/categories", icon: Layers },
    { name: "Top Brands", href: "/brands", icon: Award },
    { name: "My Wishlist", href: "/wishlist", icon: Heart },
    { name: "Shopping Cart", href: "/cart", icon: ShoppingCart },
  ];

  return (
    <main className="min-h-[80vh] bg-[#f8faf9] py-12 sm:py-20 px-4 flex items-center justify-center">
      <div className="relative overflow-hidden max-w-2xl w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-[0_12px_40px_rgba(22,163,74,0.06)]">
        {/* Decorative Background Accents */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#dcfce7]/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#dcfce7]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* 404 Visual Badge */}
          <div className="inline-flex items-center justify-center relative mb-6">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter text-gray-100 select-none">
              404
            </span>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#dcfce7] border-2 border-white text-[#16a34a] flex items-center justify-center shadow-md mx-2">
              <SearchX className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
            </div>
            <span className="text-7xl sm:text-8xl font-black tracking-tighter text-gray-100 select-none">
              4
            </span>
          </div>

          {/* Pill Tag */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0fdf4] border border-[#16a34a]/25 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
              404 Error &bull; Page Not Found
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1c2c34] tracking-tight mb-3">
            Oops! Page Not <span className="text-[#16a34a]">Found</span>
          </h1>
          <p className="text-xs sm:text-base text-[#64748b] max-w-md mx-auto leading-relaxed mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          {/* Primary Actions */}
          <div className="flex items-center justify-center flex-wrap gap-3.5 mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md shadow-[#16a34a]/20 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-gray-50 hover:bg-[#f0fdf4] border border-gray-200 hover:border-[#16a34a]/40 text-[#1e293b] hover:text-[#16a34a] font-bold text-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Destination Links */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3.5">
              Popular Destinations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-[#f0fdf4] hover:border-[#16a34a]/30 flex items-center justify-center gap-2 text-xs font-semibold text-[#334155] hover:text-[#16a34a] transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
