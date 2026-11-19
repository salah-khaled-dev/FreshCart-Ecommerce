import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCategories } from "@/api/services/routemisr.service";
import { Category } from "@/api/types";

export default async function ShopByCategory() {
  const categories: Category[] = await getAllCategories();

  // Fallback demo categories matching Route Academy API categories in case of offline/network lag
  const displayCategories =
    categories && categories.length > 0
      ? categories
      : [
          {
            _id: "6439d61c0049ad0b52b90051",
            name: "Music",
            slug: "music",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511964020.jpeg",
          },
          {
            _id: "6439d5b90049ad0b52b90048",
            name: "Men's Fashion",
            slug: "mens-fashion",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511865180.jpeg",
          },
          {
            _id: "6439d58a0049ad0b52b9003f",
            name: "Women's Fashion",
            slug: "womens-fashion",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511818071.jpeg",
          },
          {
            _id: "6439d41c67d9aa4ca97064d5",
            name: "SuperMarket",
            slug: "supermarket",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511452254.png",
          },
          {
            _id: "6439d40367d9aa4ca97064cc",
            name: "Baby & Toys",
            slug: "baby-and-toys",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511427130.png",
          },
          {
            _id: "6439d3e067d9aa4ca97064c3",
            name: "Home",
            slug: "home",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511392672.png",
          },
          {
            _id: "6439d3c867d9aa4ca97064ba",
            name: "Books",
            slug: "books",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511368164.png",
          },
          {
            _id: "6439d30b67d9aa4ca97064b1",
            name: "Beauty & Health",
            slug: "beauty-and-health",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511179514.png",
          },
          {
            _id: "6439d2f467d9aa4ca97064a8",
            name: "Mobiles",
            slug: "mobiles",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511156008.png",
          },
          {
            _id: "6439d2d167d9aa4ca970649f",
            name: "Electronics",
            slug: "electronics",
            image: "https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png",
          },
        ];

  return (
    <section className="max-w-[1320px] mx-auto px-4 py-8">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
            Shop By <span className="text-[#16a34a]">Category</span>
          </h2>
        </div>

        <Link
          href="/categories"
          className="text-sm font-semibold text-[#16a34a] hover:underline flex items-center gap-1.5 group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
        </Link>
      </div>

      {/* ── Categories Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {displayCategories.map((cat) => (
          <Link
            key={cat._id || cat.name}
            href={`/categories/${cat._id}`}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(10,173,10,0.12)] hover:border-[#16a34a] hover:-translate-y-1.5 transition-all duration-300 ease-out group cursor-pointer"
          >
            {/* Circular Image Container */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-out">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Name */}
            <span className="text-[14px] font-semibold text-[#1e293b] group-hover:text-[#16a34a] transition-colors line-clamp-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { ShopByCategory };
