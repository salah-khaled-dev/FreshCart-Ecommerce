import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ChevronRight, ArrowLeft, Layers, ShoppingBag } from "lucide-react";
import {
  getSingleCategory,
  getCategorySubcategories,
  getAllProducts,
  getSingleSubcategory,
} from "@/api/services/routemisr.service";
import SubCategory from "@/app/_components/SubCategory/SubCategory";

export default async function CategoryDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // Fetch category details, its subcategories, and all products in parallel
  const [directCategory, directSubcategories, allProducts] = await Promise.all([
    getSingleCategory(id),
    getCategorySubcategories(id),
    getAllProducts(),
  ]);

  let category = directCategory;
  let subcategories = directSubcategories;
  let initialSelectedSubId: string | null = null;

  // If the ID in the URL is a Subcategory ID (e.g. 6407ebf65bbc6e43516931ec), resolve its parent category
  if (!category) {
    const singleSub = await getSingleSubcategory(id);
    if (singleSub) {
      initialSelectedSubId = singleSub._id;
      const [parentCat, parentSubs] = await Promise.all([
        getSingleCategory(singleSub.category),
        getCategorySubcategories(singleSub.category),
      ]);
      category = parentCat;
      subcategories =
        parentSubs && parentSubs.length > 0 ? parentSubs : [singleSub];
    }
  }

  // Filter products belonging to this category (or matching the subcategory ID)
  const categoryProducts = allProducts.filter(
    (product) =>
      (category &&
        (product.category?._id === category._id ||
          product.category?.slug === category.slug ||
          product.category?.name === category.name)) ||
      product.subcategory?.some((sub) => sub._id === id)
  );

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
            <li className="hover:text-[#16a34a] transition-colors">
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </li>
            <li className="font-semibold text-[#1c2c34]">
              {category?.name || "Category Details"}
            </li>
          </ol>
        </nav>

        {/* ── 2. Category Hero Banner Card ── */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8fadf]/50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {category?.image && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 border-2 border-[#e8fadf] shadow-sm shrink-0 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </div>
              )}

              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] bg-[#e8fadf] px-3 py-1 rounded-full mb-2.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{category?.slug || "category"}</span>
                </span>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1c2c34] mb-2">
                  {category?.name || "Category Details"}
                </h1>

                <div className="flex items-center justify-center sm:justify-start flex-wrap gap-4 text-xs sm:text-sm text-[#64748b]">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#16a34a]" />
                    <strong>{subcategories.length}</strong> Subcategories
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#16a34a]" />
                    <strong>{categoryProducts.length}</strong> Products Available
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1e293b] bg-gray-50 hover:bg-[#e8fadf] hover:text-[#16a34a] border border-gray-200/80 hover:border-[#16a34a]/30 px-4 py-2.5 rounded-xl transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Categories</span>
            </Link>
          </div>
        </div>

        {/* ── 3. SubCategory Component (Subcategories Filter + Products Grid) ── */}
        <SubCategory
          category={category}
          subcategories={subcategories}
          products={categoryProducts}
          initialSelectedSubId={initialSelectedSubId}
        />
      </div>
    </main>
  );
}
