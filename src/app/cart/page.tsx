"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Home,
  ChevronRight,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Tag,
  Banknote,
  CreditCard,
  MapPin,
  Phone,
  Building2,
  X,
} from "lucide-react";
import {
  CartProductItem,
  ShippingAddressFormValues,
  AddressItem,
  OrderResponse,
} from "@/api/types";
import {
  getLoggedUserCart,
  updateCartProductQuantity,
  removeCartItem,
  clearUserCart,
  applyCouponToCart,
  createCashOrder,
  createCheckoutSession,
  getLoggedUserAddresses,
} from "@/api/services/routemisr.service";
import { shippingAddressSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export default function CartPage() {
  const [cartId, setCartId] = useState<string>("67b210df429eb834606c7a30");
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [totalCartPrice, setTotalCartPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout Modal State (Cash vs Online Stripe Session)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [savedAddresses, setSavedAddresses] = useState<AddressItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderResponse["data"]>(undefined);

  const checkoutForm = useForm<ShippingAddressFormValues>({
    defaultValues: {
      city: "",
      details: "",
      phone: "",
    },
    resolver: zodResolver(shippingAddressSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    let isMounted = true;

    Promise.all([getLoggedUserCart(), getLoggedUserAddresses()])
      .then(([cartRes, addressesRes]) => {
        if (isMounted) {
          if (cartRes.cartId) setCartId(cartRes.cartId);
          setCartProducts(cartRes.products);
          setTotalCartPrice(cartRes.totalCartPrice);
          setSavedAddresses(addressesRes);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

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

  // PUT https://ecommerce.routemisr.com/api/v2/cart/{{productId}} with { count }
  const handleUpdateQuantity = async (productId: string, newCount: number) => {
    if (updatingId) return;
    setUpdatingId(productId);

    try {
      if (newCount <= 0) {
        const { data } = await removeCartItem(productId);
        setCartProducts(data.products);
        setTotalCartPrice(data.totalCartPrice);
        showToast("Item removed from cart");
      } else {
        const { data } = await updateCartProductQuantity(productId, newCount);
        setCartProducts(data.products);
        setTotalCartPrice(data.totalCartPrice);
        showToast(`Quantity updated to ${newCount}`);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (updatingId) return;
    setUpdatingId(productId);

    try {
      const { data } = await removeCartItem(productId);
      setCartProducts(data.products);
      setTotalCartPrice(data.totalCartPrice);
      showToast("Product removed from your cart");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearUserCart();
      setCartProducts([]);
      setTotalCartPrice(0);
      setDiscountAmount(0);
      showToast("Your cart has been cleared");
    } finally {
      setIsClearing(false);
    }
  };

  // PUT https://ecommerce.routemisr.com/api/v2/cart/applyCoupon with { couponName }
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isApplyingCoupon) return;
    setIsApplyingCoupon(true);
    try {
      const res = await applyCouponToCart(promoCode, totalCartPrice);
      if (res.ok) {
        setDiscountAmount(res.discountAmount);
      }
      showToast(res.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const totalUnits = cartProducts.reduce((sum, item) => sum + item.count, 0);
  const shippingCost =
    totalCartPrice === 0 ? 0 : totalCartPrice >= 500 ? 0 : 50;
  const finalTotal =
    Math.max(0, totalCartPrice - discountAmount) + shippingCost;

  // Submit Checkout (Cash Order OR Online Stripe Checkout Session)
  const onCheckoutSubmit = async (values: ShippingAddressFormValues) => {
    if (paymentMethod === "online") {
      // POST https://ecommerce.routemisr.com/api/v1/orders/checkout-session/{{cartId}}?url=http://localhost:3000
      const returnUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const { ok, sessionUrl, message } = await createCheckoutSession(
        cartId,
        values,
        returnUrl
      );
      if (ok && sessionUrl && typeof window !== "undefined") {
        window.location.assign(sessionUrl);
        return;
      }
      showToast(
        message || "Could not start online checkout session. Placing cash order..."
      );
    }

    // POST https://ecommerce.routemisr.com/api/v1/orders/{{cartId}}
    const { ok, data } = await createCashOrder(cartId, values, finalTotal);
    if (ok) {
      setIsCheckoutOpen(false);
      setConfirmedOrder(data.data);
      setCartProducts([]);
      setTotalCartPrice(0);
      setDiscountAmount(0);
      showToast("Cash Order placed successfully!");
    }
  };

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
            <li className="font-semibold text-[#1c2c34]">Shopping Cart</li>
          </ol>
        </nav>

        {/* ── 2. Section Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
                  Shopping <span className="text-[#16a34a]">Cart</span>
                </h1>
                {!isLoading && (
                  <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-3 py-1 rounded-full">
                    {totalUnits} {totalUnits === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Review your selected items and update quantities before checkout
              </p>
            </div>
          </div>

          {cartProducts.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              disabled={isClearing}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isClearing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Order Confirmed Receipt Banner (After POST /api/v2/orders/{{cartId}}) ── */}
        {confirmedOrder && (
          <div className="bg-white rounded-3xl border-2 border-[#16a34a]/30 p-7 sm:p-10 text-center shadow-[0_8px_30px_rgba(10,173,10,0.08)] max-w-xl mx-auto my-8 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] bg-[#e8fadf] px-3 py-1 rounded-full mb-2">
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash on Delivery Order Placed</span>
            </span>
            <h2 className="text-2xl font-extrabold text-[#1c2c34] mb-2">
              Thank You for Your Order!
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mb-6">
              Your cash order{" "}
              <strong className="text-[#1c2c34]">#{confirmedOrder._id}</strong>{" "}
              has been confirmed and is being prepared for delivery.
            </p>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-left text-xs sm:text-sm space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[#64748b]">Payment Method:</span>
                <span className="font-bold text-[#1e293b] uppercase">
                  {confirmedOrder.paymentMethodType || "Cash on Delivery"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748b]">Total Amount:</span>
                <span className="font-extrabold text-[#16a34a]">
                  {confirmedOrder.totalOrderPrice} EGP
                </span>
              </div>
              {confirmedOrder.shippingAddress && (
                <div className="pt-2 border-t border-gray-200/70">
                  <span className="text-[#64748b] block mb-0.5">
                    Delivery Address:
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {confirmedOrder.shippingAddress.city} —{" "}
                    {confirmedOrder.shippingAddress.details} (
                    {confirmedOrder.shippingAddress.phone})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center flex-wrap gap-3">
              <Link
                href="/allorders"
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-all"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#1e293b] font-semibold text-sm px-6 py-3 rounded-xl transition-all"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── 3. Loading Skeleton ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5"
                >
                  <div className="w-24 h-24 rounded-xl skeleton-shimmer shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-3 w-1/4 rounded-md skeleton-shimmer" />
                    <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
                    <div className="h-4 w-1/3 rounded-md skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="h-5 w-1/2 rounded-md skeleton-shimmer" />
                <div className="h-4 w-full rounded-md skeleton-shimmer" />
                <div className="h-4 w-full rounded-md skeleton-shimmer" />
                <div className="h-11 w-full rounded-xl skeleton-shimmer-green" />
              </div>
            </div>
          </div>
        ) : cartProducts.length > 0 ? (
          /* ── 4. Cart Content (Items Left + Summary Right) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Products List */}
            <div className="lg:col-span-8 space-y-4">
              {cartProducts.map((item) => {
                const prod = item.product;
                const productId = prod?._id || prod?.id || item._id;
                const isUpdating = updatingId === productId;
                const itemSubtotal = item.price * item.count;

                return (
                  <div
                    key={productId}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-emerald-200 transition-all flex flex-col sm:flex-row items-center justify-between gap-5"
                  >
                    {/* Product Image & Details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                      <Link
                        href={`/productdetails/${productId}`}
                        className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center shrink-0 overflow-hidden relative"
                      >
                        <Image
                          src={prod?.imageCover || ""}
                          alt={prod?.title || "Product"}
                          width={80}
                          height={80}
                          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-[#16a34a] bg-[#e8fadf] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                          {prod?.category?.name || "FreshCart"}
                        </span>

                        <Link href={`/productdetails/${productId}`}>
                          <h3 className="text-base font-bold text-[#1e293b] hover:text-[#16a34a] transition-colors line-clamp-1 mb-1">
                            {prod?.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-[#64748b]">
                          Unit Price:{" "}
                          <strong className="text-[#1e293b]">
                            {item.price} EGP
                          </strong>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/70 h-10 px-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(productId, item.count - 1)
                          }
                          disabled={isUpdating}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#16a34a] hover:border-[#16a34a] disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-6 text-center text-sm font-bold text-[#1e293b]">
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[#16a34a]" />
                          ) : (
                            item.count
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(productId, item.count + 1)
                          }
                          disabled={isUpdating}
                          aria-label="Increase quantity"
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#16a34a] hover:border-[#16a34a] disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-xs text-[#64748b] block">
                          Subtotal
                        </span>
                        <span className="text-base font-extrabold text-[#16a34a]">
                          {itemSubtotal} EGP
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(productId)}
                        disabled={isUpdating}
                        aria-label="Remove item"
                        title="Remove item"
                        className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-[0_6px_28px_rgba(0,0,0,0.04)] sticky top-24">
                <h2 className="text-lg font-bold text-[#1c2c34] pb-4 mb-5 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="mb-5">
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Have a Promo Code?
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ORGANIC40"
                        className="pl-9 h-10 rounded-xl text-xs uppercase"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isApplyingCoupon}
                      className="h-10 px-4 rounded-xl border-[#16a34a] text-[#16a34a] hover:bg-[#e8fadf] text-xs font-bold cursor-pointer"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm border-b border-gray-100 pb-5 mb-5">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span>Subtotal ({totalUnits} items)</span>
                    <span className="font-semibold text-[#1e293b]">
                      {totalCartPrice} EGP
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-[#16a34a]">
                      <span>Promo Discount</span>
                      <span className="font-bold">-{discountAmount} EGP</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#64748b]">
                    <span>Shipping Estimate</span>
                    {shippingCost === 0 ? (
                      <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] px-2.5 py-0.5 rounded-full">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-[#1e293b]">
                        {shippingCost} EGP
                      </span>
                    )}
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base font-bold text-[#1c2c34]">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-[#16a34a]">
                    {finalTotal} EGP
                  </span>
                </div>

                {/* Proceed to Checkout Page (/checkout) */}
                <Link
                  href="/checkout"
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all mb-3"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop"
                  className="w-full h-10 bg-gray-50 hover:bg-gray-100 text-[#334155] font-semibold rounded-xl text-xs flex items-center justify-center transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust Perks */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs text-[#64748b]">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#16a34a] shrink-0" />
                    <span>Free delivery on orders over 500 EGP</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
                    <span>100% secure checkout & payment</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-[#16a34a] shrink-0" />
                    <span>Easy 14-day return guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── 5. Empty Cart State ── */
          !confirmedOrder && (
            <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-lg mx-auto my-8">
              <div className="w-20 h-20 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-5">
                <ShoppingCart className="w-10 h-10 stroke-[1.8]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34] mb-2">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-7">
                Looks like you haven&apos;t added any products to your cart yet.
                Browse our fresh collection and start shopping!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-sm transition-all"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        )}
      </div>

      {/* ── Checkout Modal (Cash Order OR Online Stripe Checkout Session) ── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#16a34a] to-[#16a34a] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {paymentMethod === "online" ? (
                    <CreditCard className="w-5 h-5" />
                  ) : (
                    <Banknote className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight">
                    {paymentMethod === "online"
                      ? "Online Checkout (Stripe)"
                      : "Cash on Delivery Order"}
                  </h3>
                  <p className="text-xs text-white/80">
                    Enter your shipping address details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Close checkout modal"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Toggle Tabs */}
            <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === "online"
                    ? "bg-white text-[#16a34a] shadow-xs border border-gray-200/70"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Online Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "bg-white text-[#16a34a] shadow-xs border border-gray-200/70"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            <div className="p-6">
              {/* Quick Auto-Fill from Saved Addresses if present */}
              {savedAddresses.length > 0 && (
                <div className="mb-5">
                  <span className="block text-xs font-semibold text-[#64748b] mb-2">
                    Quick Fill from Saved Addresses:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => {
                          checkoutForm.setValue("city", addr.city, {
                            shouldValidate: true,
                          });
                          checkoutForm.setValue("details", addr.details, {
                            shouldValidate: true,
                          });
                          checkoutForm.setValue("phone", addr.phone, {
                            shouldValidate: true,
                          });
                        }}
                        className="text-xs font-semibold text-[#16a34a] bg-[#e8fadf]/70 hover:bg-[#e8fadf] border border-[#16a34a]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {addr.name} ({addr.city})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={checkoutForm.handleSubmit(onCheckoutSubmit)}
                className="space-y-4"
                noValidate
              >
                <FieldGroup>
                  <Controller
                    name="city"
                    control={checkoutForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-city">City*</Label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="checkout-city"
                            type="text"
                            placeholder="Cairo / Giza"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="details"
                    control={checkoutForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-details">
                          Street & Building Details*
                        </Label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="checkout-details"
                            type="text"
                            placeholder="12 Tahrir St, Floor 3, Apt 12"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={checkoutForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-phone">Phone Number*</Label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="checkout-phone"
                            type="tel"
                            placeholder="01012345678"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#64748b] font-medium">
                    {paymentMethod === "online"
                      ? "Total to Pay Online:"
                      : "Total to Pay on Delivery:"}
                  </span>
                  <span className="text-base font-extrabold text-[#16a34a]">
                    {finalTotal} EGP
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={checkoutForm.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkoutForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {paymentMethod === "online"
                          ? "Redirecting to Stripe..."
                          : "Placing Cash Order..."}
                      </span>
                    </>
                  ) : paymentMethod === "online" ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Stripe ({finalTotal} EGP)</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4" />
                      <span>Confirm Cash Order ({finalTotal} EGP)</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
