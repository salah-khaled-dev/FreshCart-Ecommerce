"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShoppingBag } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[80vh] bg-[#f8faf9] py-12 sm:py-20 px-4 flex items-center justify-center">
      <div className="relative overflow-hidden max-w-xl w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        {/* Decorative Background Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-red-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-[#dcfce7]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Error Icon Emblem */}
          <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <AlertTriangle className="w-10 h-10 stroke-[1.8]" />
          </div>

          {/* Pill Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/70 text-red-600 text-xs font-bold uppercase tracking-wider">
              Unexpected Error
            </span>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c2c34] tracking-tight mb-3">
            Something Went <span className="text-red-500">Wrong!</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto leading-relaxed mb-5">
            We encountered an unexpected problem while loading this page. Please
            try refreshing or return to the home page.
          </p>

          {/* Optional Error Message Box */}
          {error?.message && (
            <div className="mb-7 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-[#475569] font-mono break-words max-w-md mx-auto">
              {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-3.5">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md shadow-[#16a34a]/20 transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-gray-50 hover:bg-[#f0fdf4] border border-gray-200 hover:border-[#16a34a]/40 text-[#1e293b] hover:text-[#16a34a] font-bold text-sm transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#64748b] hover:text-[#1e293b] font-semibold text-xs sm:text-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
