import React from "react";
import { getAllProducts } from "@/api/services/routemisr.service";
import { Product } from "@/api/types";
import ProductCard from "@/app/_components/ProductCard";

export default async function ShopPage() {
  const allProducts = await getAllProducts();

  return (
    <section className="max-w-[1320px] mx-auto px-4 py-8 min-h-screen">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
          Shop <span className="text-[#16a34a]">Products</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts?.map((product: Product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
