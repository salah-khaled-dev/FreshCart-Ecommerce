"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Star,
  Home,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Product } from "@/api/types";
import {
  getLoggedUserWishlist,
  removeFromWishlist,
  addToCart,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoad = async () => {
      const user = getLoggedUserFromCookies();
      if (!user) {
        if (isMounted) {
          setIsLoggedIn(false);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoggedIn(true);
      }

      try {
        const items = await getLoggedUserWishlist();
        if (isMounted) {
          setWishlistItems(items);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthAndLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleRemoveItem = async (productId: string) => {
    if (removingId) return;
    setRemovingId(productId);
    try {
      const { ok, data } = await removeFromWishlist(productId);
      if (ok) {
        setWishlistItems((prev) =>
          prev.filter((item) => (item._id || item.id) !== productId)
        );
        showToast(data.message || "Product removed from your wishlist");
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoggedIn === null) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-9 h-9 animate-spin text-[#16a34a] mb-3" />
        <p className="text-sm text-gray-500 font-medium">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (isLoggedIn === false) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#fcfdfd]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1c2c34] mb-2">
Please Login First          </h1>
          <p className="text-sm text-[#64748b] leading-relaxed mb-6">
            Please login to your account to view and save products to your wishlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-[0_4px_14px_rgba(22,163,74,0.3)] cursor-pointer"
            >
              <span>Login</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            <li className="font-semibold text-[#1c2c34]">My Wishlist</li>
          </ol>
        </nav>

        {/* ── 2. Section Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
                  My <span className="text-[#16a34a]">Wishlist</span>
                </h1>
                {!isLoading && (
                  <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-3 py-1 rounded-full">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Products you have saved to purchase later
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#16a34a] bg-[#e8fadf]/60 hover:bg-[#e8fadf] px-4 py-2.5 rounded-xl transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── 3. Loading Skeleton State ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <div className="w-full h-48 rounded-xl skeleton-shimmer mb-4" />
                <div className="h-3 w-1/3 rounded-md skeleton-shimmer mb-2" />
                <div className="h-4 w-3/4 rounded-md skeleton-shimmer mb-3" />
                <div className="h-3.5 w-1/2 rounded-md skeleton-shimmer mb-4" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-20 rounded-md skeleton-shimmer" />
                  <div className="h-9 w-28 rounded-xl skeleton-shimmer-green" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistItems.length > 0 ? (
          /* ── 4. Wishlist Items Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const productId = product._id || product.id;
              const isRemoving = removingId === productId;
              const displayPrice = product.priceAfterDiscount || product.price;

              return (
                <div
                  key={productId}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Right Remove Button (DELETE /api/v1/wishlist/:id) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(productId)}
                    disabled={isRemoving}
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-100 flex items-center justify-center shadow-2xs transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Product Image */}
                  <Link
                    href={`/productdetails/${productId}`}
                    className="w-full h-48 sm:h-52 flex items-center justify-center mb-4 pt-2 overflow-hidden relative"
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
                    <span className="text-xs text-[#64748b] font-normal mb-1 block">
                      {product.category?.name || "General"}
                    </span>

                    <Link href={`/productdetails/${productId}`}>
                      <h3
                        className="text-[16px] font-semibold text-[#1e293b] line-clamp-1 mb-2 group-hover:text-[#16a34a] transition-colors"
                        title={product.title}
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = product.ratingsAverage || 4.5;
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
                      <span className="text-xs text-[#64748b] ml-1">
                        {product.ratingsAverage || 4.5}
                      </span>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-[17px] font-bold text-[#1e293b] block">
                          {displayPrice} EGP
                        </span>
                        {product.priceAfterDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.price} EGP
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={async () => {
                          const { message } = await addToCart(productId, 1);
                          showToast(message || `"${product.title}" added to cart!`);
                        }}
                        className="h-9 px-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── 5. Empty Wishlist State ── */
          <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-lg mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-7">
              Tap the heart icon on any product to save your favorite items here
              and access them anytime.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-sm transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
