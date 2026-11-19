"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Search,
  ArrowRight,
  Award,
} from "lucide-react";
import { Brand } from "@/api/types";
import { getAllBrands } from "@/api/services/routemisr.service";
import { Input } from "@/components/ui/input";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState<number>(40);

  useEffect(() => {
    let isMounted = true;

    getAllBrands({ limit })
      .then((data) => {
        if (isMounted) {
          setBrands(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  const filteredBrands = keyword.trim()
    ? brands.filter((b) =>
        b.name.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    : brands;

  return (
    <main className="min-h-screen bg-[#fcfdfd] pb-16">
      <div className="max-w-[1320px] mx-auto px-4 pt-6">
        {/* ── 1. Breadcrumbs ── */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
            <li className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors">
              <Link href="/" className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-gray-500" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </li>
            <li className="font-semibold text-[#1c2c34]">Brands</li>
          </ol>
        </nav>

        {/* ── 2. Section Header & Filters (limit & keyword) ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
                  Top <span className="text-[#16a34a]">Brands</span>
                </h1>
                {!isLoading && (
                  <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-3 py-1 rounded-full">
                    {filteredBrands.length}{" "}
                    {filteredBrands.length === 1 ? "Brand" : "Brands"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Explore official brand stores and shop their products
              </p>
            </div>
          </div>

          {/* Search Keyword & Limit Selector */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search brand name..."
                className="pl-10 h-10 rounded-xl"
              />
            </div>

            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/70">
              {[
                { label: "10", val: 10 },
                { label: "20", val: 20 },
                { label: "All", val: 40 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    if (limit !== opt.val) {
                      setIsLoading(true);
                      setLimit(opt.val);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    limit === opt.val
                      ? "bg-white text-[#16a34a] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. Loading Skeleton ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-full h-28 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-24 rounded-md skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredBrands.length > 0 ? (
          /* ── 4. Brands Grid ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredBrands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-between text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_28px_rgba(10,173,10,0.12)] hover:border-[#16a34a] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-full h-28 flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
                  />
                </div>

                <div className="w-full pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1e293b] group-hover:text-[#16a34a] transition-colors truncate">
                    {brand.name}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#16a34a] text-gray-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1c2c34] mb-1">
              No Brands Found
            </h3>
            <p className="text-xs sm:text-sm text-[#64748b]">
              No brands matched &ldquo;{keyword}&rdquo;. Try another search term.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
