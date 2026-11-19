"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function MainSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  const slides = [
    {
      id: 1,
      image: "/images/slider/slide1.jpg",
      badge: "🌿 100% Organic & Farm Fresh",
      title: "Fresh Vegetables & Organic Produce",
      subtitle: "Get up to 40% OFF on all fresh greens & vegetables this week.",
      ctaText: "Shop Fresh Produce",
      ctaLink: "/shop",
      tagColor: "bg-emerald-500/90 text-white",
    },
    {
      id: 2,
      image: "/images/slider/slide2.jpg",
      badge: "🥖 Daily Fresh Bakery & Pastries",
      title: "Artisan Breads & Oven-Fresh Delights",
      subtitle: "Handcrafted artisan sourdough, croissants & breakfast treats baked daily.",
      ctaText: "Explore Bakery",
      ctaLink: "/shop",
      tagColor: "bg-amber-600/90 text-white",
    },
    {
      id: 3,
      image: "/images/slider/slide3.jpg",
      badge: "🥛 Farm Pure Dairy Products",
      title: "Premium Dairy, Milk & Artisanal Cheeses",
      subtitle: "Pure farm milk, rich butter and gourmet cheeses delivered cold to your door.",
      ctaText: "Shop Dairy & Eggs",
      ctaLink: "/shop",
      tagColor: "bg-blue-600/90 text-white",
    },
    {
      id: 4,
      image: "/images/slider/slide4.jpg",
      badge: "🍓 Tropical & Exotic Fruits",
      title: "Juicy Seasonal & Exotic Fruits",
      subtitle: "Packed with vitamins, handpicked from the best organic orchards.",
      ctaText: "Discover Fruits",
      ctaLink: "/shop",
      tagColor: "bg-rose-500/90 text-white",
    },
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-4 pt-6 pb-2">
      <div className="relative group rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-900">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: ".main-slider-pagination",
            bulletClass: "main-slider-bullet",
            bulletActiveClass: "main-slider-bullet-active",
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className="object-cover object-center"
                  sizes="(max-width: 1320px) 100vw, 1320px"
                />
                {/* Gradient Overlays for High Contrast Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              </div>

              {/* Text Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
                {/* Badge */}
                <div className="mb-3.5 inline-flex">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs ${slide.tagColor}`}
                  >
                    {slide.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3 sm:mb-4 drop-shadow-sm">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-none max-w-xl">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-xs sm:text-sm px-5 sm:px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#16a34a]/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Link>

                  <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl backdrop-blur-md border border-white/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>View Categories</span>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Custom Navigation Arrows (Prev / Next) ── */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#16a34a] shadow-md hover:shadow-lg flex items-center justify-center backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#16a34a] shadow-md hover:shadow-lg flex items-center justify-center backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer active:scale-90"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
        </button>

        {/* ── Custom Pagination Dots ── */}
        <div className="main-slider-pagination absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto" />
      </div>
    </section>
  );
}
