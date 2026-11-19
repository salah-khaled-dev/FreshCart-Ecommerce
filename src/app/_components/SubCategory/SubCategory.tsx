"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Layers, Tag, PackageOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { Category, Subcategory, Product } from "@/api/types";
import ProductCard from "@/app/_components/ProductCard";

interface SubCategoryProps {
  category?: Category;
  subcategories: Subcategory[];
  products: Product[];
  initialSelectedSubId?: string | null;
}

export default function SubCategory({
  category,
  subcategories,
  products,
  initialSelectedSubId = null,
}: SubCategoryProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(
    initialSelectedSubId
  );

  // Merge API subcategories with any subcategories embedded in the category's products
  const mergedSubcategories = useMemo(() => {
    const map = new Map<string, Subcategory>();
    subcategories.forEach((sub) => {
      if (sub && sub._id) map.set(sub._id, sub);
    });
    products.forEach((prod) => {
      prod.subcategory?.forEach((sub) => {
        if (sub && sub._id && !map.has(sub._id)) {
          map.set(sub._id, sub);
        }
      });
    });
    return Array.from(map.values());
  }, [subcategories, products]);

  const selectedSubcategory = useMemo(
    () => mergedSubcategories.find((s) => s._id === selectedSubId) || null,
    [mergedSubcategories, selectedSubId]
  );

  // Filter products by selected subcategory
  const filteredProducts = useMemo(() => {
    if (!selectedSubId) return products;
    return products.filter((product) =>
      product.subcategory?.some(
        (sub) =>
          sub._id === selectedSubId ||
          (selectedSubcategory &&
            sub.name.toLowerCase() === selectedSubcategory.name.toLowerCase())
      )
    );
  }, [products, selectedSubId, selectedSubcategory]);

  return (
    <div className="space-y-10">
      {/* ── 1. SubCategories Grid Section ── */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34]">
              {category?.name ? `${category.name} ` : ""}
              <span className="text-[#16a34a]">Subcategories</span>
            </h2>
            <span className="ml-1 text-xs font-semibold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-2.5 py-0.5 rounded-full">
              {mergedSubcategories.length}
            </span>
          </div>

          {selectedSubId && (
            <button
              type="button"
              onClick={() => setSelectedSubId(null)}
              className="text-xs sm:text-sm font-semibold text-[#16a34a] hover:underline cursor-pointer"
            >
              Show All ({products.length} Products)
            </button>
          )}
        </div>

        {mergedSubcategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {/* "All in Category" Filter Card */}
            <button
              type="button"
              onClick={() => setSelectedSubId(null)}
              className={`group text-left rounded-2xl border p-4 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                selectedSubId === null
                  ? "bg-[#e8fadf]/70 border-[#16a34a] shadow-[0_8px_20px_rgba(10,173,10,0.12)]"
                  : "bg-white border-gray-100 hover:border-[#16a34a]/60 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    selectedSubId === null
                      ? "bg-[#16a34a] text-white"
                      : "bg-gray-50 text-gray-600 group-hover:bg-[#e8fadf] group-hover:text-[#16a34a]"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold transition-colors ${
                      selectedSubId === null
                        ? "text-[#16a34a]"
                        : "text-[#1e293b] group-hover:text-[#16a34a]"
                    }`}
                  >
                    All {category?.name || "Subcategories"}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    {products.length} {products.length === 1 ? "Product" : "Products"}
                  </p>
                </div>
              </div>

              {selectedSubId === null && (
                <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
              )}
            </button>

            {/* Individual Subcategory Cards */}
            {mergedSubcategories.map((sub) => {
              const isSelected = selectedSubId === sub._id;
              const subProductCount = products.filter((p) =>
                p.subcategory?.some((s) => s._id === sub._id)
              ).length;

              return (
                <button
                  key={sub._id}
                  type="button"
                  onClick={() =>
                    setSelectedSubId((prev) => (prev === sub._id ? null : sub._id))
                  }
                  className={`group text-left rounded-2xl border p-4 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#e8fadf]/70 border-[#16a34a] shadow-[0_8px_20px_rgba(10,173,10,0.12)]"
                      : "bg-white border-gray-100 hover:border-[#16a34a]/60 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#16a34a] text-white"
                          : "bg-gray-50 text-gray-600 group-hover:bg-[#e8fadf] group-hover:text-[#16a34a]"
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-bold truncate transition-colors ${
                          isSelected
                            ? "text-[#16a34a]"
                            : "text-[#1e293b] group-hover:text-[#16a34a]"
                        }`}
                        title={sub.name}
                      >
                        {sub.name}
                      </h3>
                      <p className="text-xs text-[#64748b] truncate">
                        {subProductCount > 0
                          ? `${subProductCount} ${
                              subProductCount === 1 ? "Product" : "Products"
                            }`
                          : sub.slug}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 text-center text-sm text-[#64748b]">
            No subcategories found for this category.
          </div>
        )}
      </section>

      {/* ── 2. Category / Subcategory Products Section ── */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34]">
              {selectedSubcategory ? (
                <>
                  {selectedSubcategory.name}{" "}
                  <span className="text-[#16a34a]">Products</span>
                </>
              ) : (
                <>
                  {category?.name || "Category"}{" "}
                  <span className="text-[#16a34a]">Products</span>
                </>
              )}
            </h2>
            <span className="ml-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-xl mx-auto my-4">
            <div className="w-16 h-16 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1c2c34] mb-2">
              No Products Available right now
            </h3>
            <p className="text-sm text-[#64748b] mb-6">
              {selectedSubcategory
                ? `There are currently no products listed under "${selectedSubcategory.name}".`
                : `There are currently no products listed under "${
                    category?.name || "this category"
                  }".`}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {selectedSubId && products.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSubId(null)}
                  className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <span>View All {category?.name} Products</span>
                </button>
              )}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#1e293b] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                <span>Browse All Shop Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
