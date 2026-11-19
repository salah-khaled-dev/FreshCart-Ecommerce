"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Home,
  ChevronRight,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  Loader2,
  MessageSquarePlus,
  Pencil,
  Trash2,
  X,
  ShieldAlert,
} from "lucide-react";
import { Product, ReviewItem, CreateReviewFormValues } from "@/api/types";
import ProductCard from "@/app/_components/ProductCard";
import {
  addToWishlist,
  removeFromWishlist,
  getStoredWishlistIds,
  addToCart,
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import { createReviewSchema } from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsView({
  product,
  relatedProducts,
}: ProductDetailsViewProps) {
  // Collect all images from product
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (product.imageCover) list.push(product.imageCover);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : [product.imageCover || ""];
  }, [product]);

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "shipping">("details");
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [loggedUserName, setLoggedUserName] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const productId = product._id || product.id;

  useEffect(() => {
    const syncUser = () => {
      const user = getLoggedUserFromCookies();
      if (user?.name) {
        setLoggedUserName(user.name);
      }
    };
    syncUser();
    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  const reviewForm = useForm<CreateReviewFormValues>({
    defaultValues: {
      review: "",
      rating: 5,
    },
    resolver: zodResolver(createReviewSchema),
    mode: "onTouched",
  });

  const selectedRating = reviewForm.watch("rating") || 5;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingReviews(true);
    getProductReviews(productId)
      .then((data) => {
        if (isMounted) {
          setReviews(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const onReviewSubmit = async (values: CreateReviewFormValues) => {
    setReviewMessage(null);

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (editingReviewId) {
      const { ok, reviewItem, message } = await updateProductReview(
        editingReviewId,
        values
      );
      if (ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === editingReviewId
              ? reviewItem || {
                  ...r,
                  review: values.review,
                  rating: values.rating,
                }
              : r
          )
        );
        setEditingReviewId(null);
        reviewForm.reset({ review: "", rating: 5 });
        setReviewMessage(message);
        setTimeout(() => setReviewMessage(null), 3000);
      }
      return;
    }

    const { ok, reviewItem, message } = await createProductReview(
      productId,
      values
    );
    if (ok) {
      setReviews((prev) => [reviewItem, ...prev]);
      reviewForm.reset({ review: "", rating: 5 });
      setReviewMessage(message);
      setTimeout(() => setReviewMessage(null), 3000);
    }
  };

  const handleStartEditReview = (rev: ReviewItem) => {
    setEditingReviewId(rev._id);
    reviewForm.reset({
      review: rev.review,
      rating: rev.rating || 5,
    });
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    reviewForm.reset({ review: "", rating: 5 });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (deletingReviewId) return;
    setDeletingReviewId(reviewId);
    try {
      const { ok, message } = await deleteProductReview(reviewId);
      if (ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        if (editingReviewId === reviewId) {
          handleCancelEditReview();
        }
        setReviewMessage(message);
        setTimeout(() => setReviewMessage(null), 3000);
      }
    } finally {
      setDeletingReviewId(null);
    }
  };

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

  const handleToggleWishlist = async () => {
    if (isTogglingWishlist) return;

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        const { ok, data } = await removeFromWishlist(productId);
        if (ok) {
          setIsWishlisted(false);
          setAddedToast(data.message || "Removed from Wishlist");
          setTimeout(() => setAddedToast(null), 2500);
        }
      } else {
        const { ok, data } = await addToWishlist(productId);
        if (ok) {
          setIsWishlisted(true);
          setAddedToast(data.message || "Added to Wishlist successfully!");
          setTimeout(() => setAddedToast(null), 2500);
        }
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const finalPrice = product.priceAfterDiscount || product.price;
  const totalPrice = (finalPrice * quantity).toFixed(2);
  const availableStock = product.quantity || 220;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < availableStock) setQuantity((prev) => prev + 1);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsAddingToCart(true);
    try {
      const { ok, message } = await addToCart(productId, quantity);
      if (ok) {
        setAddedToast(message || `Added ${quantity} item(s) to Cart!`);
        setTimeout(() => setAddedToast(null), 2500);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAddingToCart) return;

    const user = getLoggedUserFromCookies();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(productId, quantity);
      router.push("/cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-[1320px] mx-auto px-4 pt-4">
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
              <Link
                href={
                  product.category?._id
                    ? `/categories/${product.category._id}`
                    : "/categories"
                }
              >
                {product.category?.name || "Women's Fashion"}
              </Link>
            </li>
            {product.subcategory && product.subcategory[0] && (
              <>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </li>
                <li className="hover:text-[#16a34a] transition-colors">
                  <Link href={`/categories/${product.subcategory[0]._id}`}>
                    {product.subcategory[0].name}
                  </Link>
                </li>
              </>
            )}
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </li>
            <li className="font-semibold text-gray-900 line-clamp-1">
              {product.title}
            </li>
          </ol>
        </nav>

        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12">
    
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="w-full aspect-square bg-[#f8f9fa] rounded-xl flex items-center justify-center p-6 overflow-hidden mb-5">
                <Image
                  src={selectedImage || product.imageCover}
                  alt={product.title}
                  width={500}
                  height={500}
                  priority
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((img, idx) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg bg-[#f8f9fa] p-2 flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-2 border-gray-800 shadow-xs"
                          : "border border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumb ${idx + 1}`}
                        width={80}
                        height={80}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right Product Info (col-span-7) ── */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Badges: Category & Brand */}
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    href={
                      product.category?._id
                        ? `/categories/${product.category._id}`
                        : "/categories"
                    }
                    className="text-xs font-semibold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/30 px-3 py-1 rounded-full hover:bg-[#dcfce7] transition-colors"
                  >
                    {product.category?.name || "Women's Fashion"}
                  </Link>

                  {product.brand?.name && (
                    <Link
                      href={
                        product.brand?._id
                          ? `/brands/${product.brand._id}`
                          : "/brands"
                      }
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-1 rounded-full transition-colors"
                    >
                      {product.brand.name}
                    </Link>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = product.ratingsAverage || 4.8;
                      const isFilled = star <= Math.floor(rating);
                      const isHalf = !isFilled && star - 0.5 <= rating;

                      return (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
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
                  <span className="text-xs text-gray-500 font-medium">
                    {product.ratingsAverage || 4.8} ({product.ratingsQuantity || 18} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {finalPrice} EGP
                  </span>
                </div>

                {/* In Stock Badge */}
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16a34a] bg-[#e8fadf]/60 border border-[#16a34a]/30 px-2.5 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    In Stock
                  </span>
                </div>

                {/* Description Attributes Line */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {product.description ||
                    "Material Polyester Blend Colour Name Multicolour Department Women"}
                </p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white h-9 px-3 w-32 justify-between">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        className="text-gray-500 hover:text-gray-800 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-sm font-semibold text-gray-800">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={handleIncrease}
                        aria-label="Increase quantity"
                        disabled={quantity >= availableStock}
                        className="text-gray-500 hover:text-gray-800 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs text-gray-500">
                      {availableStock} available
                    </span>
                  </div>
                </div>

                {/* Total Price Row */}
                <div className="flex items-center justify-between pt-2 pb-3 mb-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Price:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#19a24a]">
                    {totalPrice} EGP
                  </span>
                </div>

                {/* Toast message if present */}
                {addedToast && (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#19a24a]" />
                    <span>{addedToast}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mb-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full h-11 bg-[#19a24a] hover:bg-[#168a3e] active:scale-[0.99] text-white font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-11 bg-[#101928] hover:bg-[#1a2538] active:scale-[0.99] text-white font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Buy Now</span>
                  </button>
                </div>

            
                <div className="flex items-center gap-2.5 mb-6">
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={isTogglingWishlist}
                    className={`flex-1 h-10 border border-gray-200/90 rounded-lg bg-white hover:bg-gray-50/80 active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isWishlisted ? "text-red-500 border-red-200 bg-red-50/40" : "text-gray-600"
                    }`}
                  >
                    {isTogglingWishlist ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                    ) : (
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500 stroke-[1.8]"
                        }`}
                      />
                    )}
                    <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="w-10 h-10 border border-gray-200/90 rounded-lg bg-white hover:bg-gray-50/80 active:scale-[0.95] flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all cursor-pointer shrink-0"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-[#19a24a]" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Perks Row */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Free Delivery */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Free Delivery</h4>
                    <p className="text-[11px] text-gray-500">Orders over 500</p>
                  </div>
                </div>

                {/* 2. 30 Days Return */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">30 Days Return</h4>
                    <p className="text-[11px] text-gray-500">Money back</p>
                  </div>
                </div>

                {/* 3. Secure Payment */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Secure Payment</h4>
                    <p className="text-[11px] text-gray-500">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Tabs Navigation Matching Screenshot ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 overflow-x-auto">
            {/* Tab 1: Product Details */}
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "details"
                  ? "bg-[#e8fadf] text-[#16a34a] border border-[#16a34a]/30"
                  : "text-gray-600 hover:text-gray-900 bg-transparent"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Details</span>
            </button>

            {/* Tab 2: Reviews */}
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "reviews"
                  ? "bg-[#e8fadf] text-[#16a34a] border border-[#16a34a]/30"
                  : "text-gray-600 hover:text-gray-900 bg-transparent"
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews ({product.ratingsQuantity || 18})</span>
            </button>

            {/* Tab 3: Shipping & Returns */}
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "shipping"
                  ? "bg-[#e8fadf] text-[#16a34a] border border-[#16a34a]/30"
                  : "text-gray-600 hover:text-gray-900 bg-transparent"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipping & Returns</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === "details" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 text-sm text-gray-600 leading-relaxed">
                <h3 className="font-bold text-base text-gray-900">About this item</h3>
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">Category</span>
                    <span>{product.category?.name || "General"}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">Brand</span>
                    <span>{product.brand?.name || "DeFacto"}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">Stock Availability</span>
                    <span>{availableStock} units in stock</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">SKU</span>
                    <span>{product._id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Add Review Form (POST /api/v1/products/{{productId}}/reviews) */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
                    <div className="flex items-center justify-between gap-2.5 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#e8fadf] text-[#16a34a] flex items-center justify-center">
                          {editingReviewId ? (
                            <Pencil className="w-4 h-4" />
                          ) : (
                            <MessageSquarePlus className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#1c2c34]">
                            {editingReviewId
                              ? "Update Your Review"
                              : "Write a Review"}
                          </h3>
                          <p className="text-xs text-[#64748b]">
                            {editingReviewId
                              ? "Modify your rating and review text"
                              : "Share your experience with this product"}
                          </p>
                        </div>
                      </div>

                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={handleCancelEditReview}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>

                    {reviewMessage && (
                      <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#16a34a] shrink-0" />
                        <span>{reviewMessage}</span>
                      </div>
                    )}

                    <form
                      onSubmit={reviewForm.handleSubmit(onReviewSubmit)}
                      className="space-y-4"
                      noValidate
                    >
                      {/* Rating Selector (1 - 5 Stars) */}
                      <div>
                        <Label className="mb-2">Your Rating*</Label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() =>
                                reviewForm.setValue("rating", starValue, {
                                  shouldValidate: true,
                                })
                              }
                              aria-label={`Rate ${starValue} stars`}
                              className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  starValue <= selectedRating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-bold text-[#1e293b]">
                            {selectedRating} / 5
                          </span>
                        </div>
                      </div>

                      {/* Review Text Input */}
                      <Controller
                        name="review"
                        control={reviewForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="product-review-input">
                              Your Review*
                            </Label>
                            <Input
                              {...field}
                              id="product-review-input"
                              type="text"
                              placeholder="Great product"
                              aria-invalid={fieldState.invalid}
                              className="rounded-xl"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={reviewForm.formState.isSubmitting}
                        className="w-full h-10 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {reviewForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                              {editingReviewId
                                ? "Updating Review..."
                                : "Submitting Review..."}
                            </span>
                          </>
                        ) : (
                          <span>
                            {editingReviewId
                              ? "Update Review"
                              : "Submit Review"}
                          </span>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Right Column: Existing Reviews List */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-extrabold text-gray-900">
                          {product.ratingsAverage || 4.8}
                        </div>
                        <div>
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className="w-4 h-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            Based on{" "}
                            {(product.ratingsQuantity || 18) + reviews.length}{" "}
                            ratings
                          </span>
                        </div>
                      </div>
                    </div>

                    {isLoadingReviews ? (
                      <div className="space-y-4">
                        <div className="h-4 w-1/3 rounded-md skeleton-shimmer" />
                        <div className="h-3 w-3/4 rounded-md skeleton-shimmer" />
                      </div>
                    ) : (
                      <div className="space-y-4 divide-y divide-gray-100">
                        {reviews.map((rev) => (
                          <div
                            key={rev._id}
                            className={`[&:not(:first-child)]:pt-4 space-y-1.5 rounded-xl transition-colors ${
                              editingReviewId === rev._id
                                ? "bg-[#f0fdf4] p-3 border border-[#16a34a]/30"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-full bg-[#e8fadf] text-[#16a34a] font-bold text-xs flex items-center justify-center shrink-0">
                                  {(
                                    rev.user?.name ||
                                    loggedUserName ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                                <span className="font-bold text-gray-800 text-sm">
                                  {rev.user?.name || loggedUserName || "User"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span>
                                  {rev.createdAt
                                    ? new Date(
                                        rev.createdAt
                                      ).toLocaleDateString()
                                    : "Just now"}
                                </span>

                                {/* Edit Review Button (PUT /api/v1/reviews/{{reviewId}}) */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEditReview(rev)}
                                  title="Edit review"
                                  aria-label="Edit review"
                                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#e8fadf] text-gray-600 hover:text-[#16a34a] transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Review Button (DELETE /api/v1/reviews/{{reviewId}}) */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(rev._id)}
                                  disabled={deletingReviewId === rev._id}
                                  title="Delete review"
                                  aria-label="Delete review"
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                                >
                                  {deletingReviewId === rev._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= (rev.rating || 5)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              {rev.review}
                            </p>
                          </div>
                        ))}

                        {reviews.length === 0 && (
                          <div className="py-8 text-center text-sm text-[#64748b]">
                            No reviews yet. Be the first to review this product!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3 text-sm text-gray-600">
                <h4 className="font-bold text-gray-900 text-base">Shipping Information</h4>
                <p>Standard delivery within 2-4 business days across Egypt.</p>
                <h4 className="font-bold text-gray-900 text-base pt-2">Return Policy</h4>
                <p>Hassle-free 30 days return window. Full money back guarantee.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Related Products Section ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-7 w-1.5 bg-[#16a34a] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Related <span className="text-[#16a34a]">Products</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct._id || relProduct.id}
                  product={relProduct}
                />
              ))}
            </div>
          </section>
        )}
        {/* ── 5. Auth Required Modal ── */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 sm:p-7 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1c2c34] mb-2">
                يجب تسجيل الدخول أولاً
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                يرجى تسجيل الدخول إلى حسابك لتتمكن من إضافة هذا المنتج إلى السلة أو المفضلة أو كتابة تقييمك.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/login"
                  className="flex-1 h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-[0_4px_14px_rgba(22,163,74,0.3)] cursor-pointer"
                >
                  <span>تسجيل الدخول</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
