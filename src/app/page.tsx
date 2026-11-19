import React, { Suspense } from "react";
import MainSlider from "./_components/MainSlider/MainSlider";
import ShopByCategory from "./_components/ShopByCategory/ShopByCategory";
import PromoBanners from "./_components/PromoBanners/PromoBanners";
import FeaturedProducts from "./_components/allcategerois/FeaturedProducts/FeaturedProducts";
import NewsletterAppBanner from "./_components/NewsletterAppBanner/NewsletterAppBanner";

function ShopByCategorySkeleton() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 py-8">
      <div className="h-7 w-48 rounded-md skeleton-shimmer mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton-shimmer mb-3" />
            <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Main Hero Slider */}
      <MainSlider />

      {/* 2. Shop By Category */}
      <Suspense fallback={<ShopByCategorySkeleton />}>
        <ShopByCategory />
      </Suspense>

      {/* 4. Promotional Banners */}
      <PromoBanners />

      {/* 5. Featured Products */}
      <FeaturedProducts />

      {/* 6. Newsletter & Mobile App Banner */}
      <NewsletterAppBanner />
    </main>
  );
}
