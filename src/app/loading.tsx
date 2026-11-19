import React from "react";
import { ShoppingCart } from "lucide-react";

export default function Loading() {
  return (
    <>
      {/* Top Indeterminate Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] overflow-hidden bg-emerald-100/80"
      >
        <div className="h-full w-1/3 bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#16a34a] rounded-full animate-loading-bar" />
      </div>

      {/* Centered FreshCart Loader + Responsive Preview Cards */}
      <main
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="min-h-[70vh] w-full bg-white flex flex-col items-center justify-center px-4 py-10 sm:py-16"
      >
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#e8fadf]/70 animate-pulse"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[3px] border-emerald-100 border-t-[#16a34a] animate-spin"
          />
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-emerald-100 shadow-[0_8px_24px_rgba(10,173,10,0.14)] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-[#16a34a]" />
          </div>
        </div>

        {/* Brand Title & Subtitle */}
        <h2 className="mt-5 text-xl sm:text-2xl font-extrabold tracking-tight text-[#1c2c34]">
          Fresh<span className="text-[#16a34a]">Cart</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#64748b] text-center">
          Loading fresh products for you...
        </p>

        {/* Three Staggered Bouncing Dots */}
        <div aria-hidden="true" className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce" />
        </div>

        {/* Compact Responsive Card Shimmer Preview */}
        <div
          aria-hidden="true"
          className="w-full max-w-[1040px] mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5"
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex-col justify-between ${
                idx >= 2 ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="w-full h-24 sm:h-32 rounded-xl skeleton-shimmer mb-3" />
              <div className="h-3 w-3/4 rounded-md skeleton-shimmer mb-2" />
              <div className="h-2.5 w-1/2 rounded-md skeleton-shimmer mb-3" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-3.5 w-14 rounded-md skeleton-shimmer" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full skeleton-shimmer-green" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
