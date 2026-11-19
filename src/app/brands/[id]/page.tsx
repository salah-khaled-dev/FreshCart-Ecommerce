import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Award,
  ShoppingBag,
  PackageOpen,
  ArrowRight,
} from "lucide-react";
import {
  getSingleBrand,
  getAllProducts,
} from "@/api/services/routemisr.service";
import ProductCard from "@/app/_components/ProductCard";

export default async function BrandDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [brand, allProducts] = await Promise.all([
    getSingleBrand(id),
    getAllProducts(),
  ]);

  const brandProducts = allProducts.filter(
    (product) =>
      product.brand?._id === id ||
      (brand &&
        (product.brand?._id === brand._id ||
          product.brand?.slug === brand.slug ||
          product.brand?.name?.toLowerCase() === brand.name?.toLowerCase()))
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
              <Link href="/brands">Brands</Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </li>
            <li className="font-semibold text-[#1c2c34]">
              {brand?.name || "Brand Details"}
            </li>
          </ol>
        </nav>

        {/* ── 2. Brand Hero Banner Card ── */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8fadf]/50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {brand?.image && (
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white border-2 border-[#e8fadf] p-3 flex items-center justify-center shadow-2xs shrink-0 relative">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={100}
                    height={100}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] bg-[#e8fadf] px-3 py-1 rounded-full mb-2.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{brand?.slug || "official-brand"}</span>
                </span>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1c2c34] mb-2">
                  {brand?.name || "Brand Store"}
                </h1>

                <div className="flex items-center justify-center sm:justify-start flex-wrap gap-4 text-xs sm:text-sm text-[#64748b]">
                  <span className="inline-flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#16a34a]" />
                    <strong>{brandProducts.length}</strong> Products Available
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/brands"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1e293b] bg-gray-50 hover:bg-[#e8fadf] hover:text-[#16a34a] border border-gray-200/80 hover:border-[#16a34a]/30 px-4 py-2.5 rounded-xl transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Brands</span>
            </Link>
          </div>
        </div>

        {/* ── 3. Brand Products Section ── */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34]">
              {brand?.name || "Brand"}{" "}
              <span className="text-[#16a34a]">Products</span>
            </h2>
            <span className="ml-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {brandProducts.length}
            </span>
          </div>

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brandProducts.map((product) => (
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
                No Products Available for {brand?.name || "this brand"}
              </h3>
              <p className="text-sm text-[#64748b] mb-6">
                There are currently no products listed under this brand in the
                catalog.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  <span>Explore Other Brands</span>
                </Link>
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
    </main>
  );
}
