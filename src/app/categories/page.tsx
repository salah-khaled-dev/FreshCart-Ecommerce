import React from "react";
import Link from "next/link";
import { ArrowRight, Home, ChevronRight } from "lucide-react";
import { getAllCategories } from "@/api/services/routemisr.service";
import { Category } from "@/api/types";

export default async function CategoriesPage() {
  const categories: Category[] = await getAllCategories();

  return (
    <main className="min-h-screen bg-[#fcfdfd] pb-16">
      <div className="max-w-[1320px] mx-auto px-4 pt-6">
        {/* Breadcrumbs */}
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
            <li className="font-semibold text-[#1c2c34]">Categories</li>
          </ol>
        </nav>

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
              All <span className="text-[#16a34a]">Categories</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              Select a category to explore its subcategories and products
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(10,173,10,0.12)] hover:border-[#16a34a] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="w-full h-56 overflow-hidden bg-gray-50 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1e293b] group-hover:text-[#16a34a] transition-colors">
                    {cat.name}
                  </h2>
                  <span className="text-xs text-[#64748b]">
                    View Subcategories
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-gray-50 group-hover:bg-[#16a34a] text-gray-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
