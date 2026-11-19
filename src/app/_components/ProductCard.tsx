"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, RefreshCw, Eye, Star, Plus, Loader2, ShieldAlert } from "lucide-react";
import { Product } from "@/api/types";
import {
  addToWishlist,
  removeFromWishlist,
  getStoredWishlistIds,
  addToCart,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";

export default function ProductCard({ product }: { product: Product }) {
  const productId = product._id || product.id;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    const syncWishlistState = () => {
      const ids = getStoredWishlistIds();
      setIsWishlisted(ids.includes(productId));
    };
    syncWishlistState();
    window.addEventListener("wishlist-change", syncWishlistState);
    return () => {
      window.removeEventListener("wishlist-change", syncWishlistState);
    };
  }, [productId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingWishlist) return;

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        const { ok, data } = await removeFromWishlist(productId);
        if (ok) {
          setIsWishlisted(false);
          setWishlistToast(data.message || "Removed from wishlist");
          setTimeout(() => setWishlistToast(null), 2200);
        }
      } else {
        const { ok, data } = await addToWishlist(productId);
        if (ok) {
          setIsWishlisted(true);
          setWishlistToast(data.message || "Added to wishlist!");
          setTimeout(() => setWishlistToast(null), 2200);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleShareProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopying) return;
    setIsCopying(true);

    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}/productdetails/${productId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl).catch(() => {});
      }
      setWishlistToast("تم نسخ رابط المنتج بنجاح!");
      setTimeout(() => {
        setIsCopying(false);
        setWishlistToast(null);
      }, 2200);
    }
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingCart) return;

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    setIsAddingCart(true);
    try {
      const { ok, message } = await addToCart(productId, 1);
      if (ok) {
        setWishlistToast(message || "Added to cart!");
        setTimeout(() => setWishlistToast(null), 2200);
      }
    } finally {
      setIsAddingCart(false);
    }
  };

  return (
    <div
      key={productId}
      className="group relative bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between h-full"
    >
      {/* Auth Prompt Overlay */}
      {showAuthPrompt && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200 border-2 border-[#16a34a]/30 shadow-lg"
        >
          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-2 shadow-2xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#1c2c34] mb-1">
            يجب تسجيل الدخول أولاً
          </p>
          <p className="text-[11px] text-[#64748b] leading-relaxed mb-3.5">
            يرجى تسجيل الدخول لتتمكن من إضافة المنتجات إلى السلة أو المفضلة.
          </p>
          <div className="flex items-center gap-2 w-full justify-center">
            <Link
              href="/login"
              className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              تسجيل الدخول
            </Link>
            <button
              type="button"
              onClick={() => setShowAuthPrompt(false)}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Feedback Toast Badge */}
      {wishlistToast && (
        <div className="absolute top-3 left-3 right-12 z-20 bg-[#1c2c34]/95 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-md line-clamp-1 animate-in fade-in duration-150">
          {wishlistToast}
        </div>
      )}

      {/* Top Right Actions (Wishlist, Compare, Quick View) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-8 h-8 rounded-full shadow-sm border flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white border-gray-100 text-gray-600 hover:text-red-500 hover:border-red-200"
          }`}
        >
          {isTogglingWishlist ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
          ) : (
            <Heart
              className={`w-4 h-4 stroke-[1.8] ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          )}
        </button>

        <button
          type="button"
          onClick={handleShareProduct}
          aria-label="Share product link"
          title="نسخ رابط المنتج"
          className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#16a34a] hover:border-emerald-200 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <RefreshCw
            className={`w-4 h-4 stroke-[1.8] ${
              isCopying ? "animate-spin text-[#16a34a]" : ""
            }`}
          />
        </button>

        <Link
          href={`/productdetails/${productId}`}
          aria-label="Quick view"
          className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#16a34a] hover:border-emerald-200 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Eye className="w-4 h-4 stroke-[1.8]" />
        </Link>
      </div>

      {/* Product Image */}
      <Link
        href={`/productdetails/${productId}`}
        className="w-full h-48 sm:h-52 flex items-center justify-center mb-4 pt-2 overflow-hidden"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          width={300}
          height={300}
          className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs text-[#64748b] font-normal mb-1 block">
          {product.category?.name || "General"}
        </span>

        {/* Title */}
        <Link href={`/productdetails/${productId}`}>
          <h3
            className="text-[16px] font-semibold text-[#1e293b] line-clamp-1 mb-2 group-hover:text-[#16a34a] transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>

        {/* Ratings (5 Stars + Score + Count) */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = product.ratingsAverage || 0;
              const isFilled = star <= Math.floor(rating);
              const isHalf = !isFilled && star - 0.5 <= rating;

              return (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    isFilled
                      ? "fill-amber-400 text-amber-400"
                      : isHalf
                      ? "fill-amber-400/50 text-amber-400"
                      : "text-amber-400"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs text-[#64748b] ml-1.5 font-normal">
            {product.ratingsAverage} ({product.ratingsQuantity || 50})
          </span>
        </div>

        {/* Bottom: Price + Green Plus Button */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[17px] font-bold text-[#1e293b]">
            {product.price} EGP
          </span>

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={isAddingCart}
            aria-label="Add to cart"
            className="w-10 h-10 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center shadow-sm hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60"
          >
            {isAddingCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
