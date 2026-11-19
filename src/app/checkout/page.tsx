"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReceiptText,
  ArrowLeft,
  Home,
  Bookmark,
  MapPin,
  Phone,
  Building2,
  Plus,
  Info,
  CreditCard,
  Banknote,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Package,
  Check,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  CartProductItem,
  ShippingAddressFormValues,
  AddressItem,
  OrderResponse,
} from "@/api/types";
import {
  getLoggedUserCart,
  getLoggedUserAddresses,
  createCashOrder,
  createCheckoutSession,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import { shippingAddressSchema } from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [cartId, setCartId] = useState<string>("67b210df429eb834606c7a30");
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [totalCartPrice, setTotalCartPrice] = useState<number>(0);
  const [savedAddresses, setSavedAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] =
    useState<OrderResponse["data"]>(undefined);

  const form = useForm<ShippingAddressFormValues>({
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
        const [cartRes, addressesRes] = await Promise.all([
          getLoggedUserCart(),
          getLoggedUserAddresses(),
        ]);
        if (isMounted) {
          if (cartRes.cartId) setCartId(cartRes.cartId);
          setCartProducts(cartRes.products);
          setTotalCartPrice(cartRes.totalCartPrice);
          setSavedAddresses(addressesRes);

          if (addressesRes.length > 0) {
            const first = addressesRes[0];
            setSelectedAddressId(first._id);
            form.reset({
              city: first.city,
              details: first.details,
              phone: first.phone,
            });
          }
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
  }, [form]);

  const handleSelectSavedAddress = (addr: AddressItem) => {
    setSelectedAddressId(addr._id);
    form.setValue("city", addr.city, { shouldValidate: true });
    form.setValue("details", addr.details, { shouldValidate: true });
    form.setValue("phone", addr.phone, { shouldValidate: true });
  };

  const handleUseDifferentAddress = () => {
    setSelectedAddressId(null);
    form.reset({
      city: "",
      details: "",
      phone: "",
    });
  };

  const totalUnits = cartProducts.reduce((sum, item) => sum + item.count, 0);
  const shippingCost =
    totalCartPrice === 0 ? 0 : totalCartPrice >= 500 ? 0 : 50;
  const finalTotal = totalCartPrice + shippingCost;

  const onSubmitOrder = async (values: ShippingAddressFormValues) => {
    setApiError(null);

    if (paymentMethod === "online") {
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
      setApiError(
        message ||
          "Could not start Stripe session for this cart. Placing order..."
      );
    }

    const { ok, data } = await createCashOrder(cartId, values, finalTotal);
    if (ok) {
      setConfirmedOrder(data.data);
      setCartProducts([]);
      setTotalCartPrice(0);
      setTimeout(() => {
        router.push("/allorders");
      }, 2200);
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
          Please login to your account to view and manage your delivery addresses or add a new address.          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-[0_4px_14px_rgba(22,163,74,0.3)] cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
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

  if (confirmedOrder) {
    return (
      <main className="min-h-screen bg-[#f9fbfa] py-14 px-4">
        <div className="bg-white rounded-3xl border-2 border-[#16a34a]/30 p-8 sm:p-10 text-center shadow-[0_8px_30px_rgba(22,163,74,0.08)] max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1c2c34] mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] mb-6">
            Your order{" "}
            <strong className="text-[#1c2c34]">#{confirmedOrder._id}</strong>{" "}
            has been confirmed. Redirecting to your orders...
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/allorders"
              className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] py-8 sm:py-10 px-4">
      <div className="max-w-[1220px] mx-auto">
        {/* ── Page Header Matching Reference Image ── */}
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shadow-xs shrink-0">
                <ReceiptText className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#1e293b] tracking-tight">
                Complete Your Order
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Review your items and complete your purchase
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#16a34a] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {apiError && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
            {apiError}
          </div>
        )}

        {/* ── Main Two-Column Checkout Grid ── */}
        <form
          onSubmit={form.handleSubmit(onSubmitOrder)}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start"
        >
          {/* ── LEFT COLUMN: Shipping Address + Payment Method ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Shipping Address Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
              {/* Green Header Bar */}
              <div className="bg-[#16a34a] px-6 py-4 text-white">
                <div className="flex items-center gap-2.5 font-bold text-base">
                  <Home className="w-4 h-4" />
                  <h2>Shipping Address</h2>
                </div>
                <p className="text-xs text-white/85 mt-0.5">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Saved Addresses Section */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1e293b] mb-1">
                    <Bookmark className="w-4 h-4 text-[#16a34a] fill-[#16a34a]" />
                    <span>Saved Addresses</span>
                  </div>
                  <p className="text-xs text-[#64748b] mb-3.5">
                    Select a saved address or enter a new one below
                  </p>

                  <div className="space-y-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`w-full text-left rounded-xl border p-4 transition-all flex items-start gap-3.5 cursor-pointer ${
                            isSelected
                              ? "border-[#16a34a] bg-[#f0fdf4]/40 shadow-2xs"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1e293b]">
                              {addr.name || addr.city}
                            </p>
                            <p className="text-xs text-[#64748b] mt-0.5">
                              {addr.details}
                            </p>
                            <div className="flex items-center flex-wrap gap-4 mt-2 text-[11px] text-[#64748b]">
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {addr.phone}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {addr.city}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Dashed "Use a different address" Button */}
                    <button
                      type="button"
                      onClick={handleUseDifferentAddress}
                      className={`w-full text-left rounded-xl border-2 border-dashed p-4 transition-all flex items-center gap-3.5 cursor-pointer ${
                        selectedAddressId === null
                          ? "border-[#16a34a] bg-[#f0fdf4]/80"
                          : "border-[#16a34a]/50 bg-[#f0fdf4]/40 hover:bg-[#f0fdf4]/70"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#16a34a]">
                          Use a different address
                        </p>
                        <p className="text-xs text-[#64748b]">
                          Enter a new shipping address manually
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Delivery Information Alert Box */}
                <div className="rounded-xl bg-[#eff6ff]/80 border border-blue-100 p-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">
                      Delivery Information
                    </h4>
                    <p className="text-[11px] text-blue-600 mt-0.5">
                      Please ensure your address is accurate for smooth delivery
                    </p>
                  </div>
                </div>

                {/* Form Inputs: City, Street Address, Phone Number */}
                <FieldGroup>
                  {/* City */}
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-city">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="checkout-city"
                            type="text"
                            placeholder="e.g. Cairo, Alexandria, Giza"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 h-11 rounded-xl"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Street Address */}
                  <Controller
                    name="details"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-details">
                          Street Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <textarea
                            {...field}
                            id="checkout-details"
                            rows={3}
                            placeholder="Street name, building number, floor, apartment..."
                            aria-invalid={fieldState.invalid}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#1e293b] placeholder:text-gray-400 focus:border-[#16a34a] focus:outline-none focus:ring-3 focus:ring-[#16a34a]/15 aria-invalid:border-red-400 resize-none"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Phone Number */}
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="checkout-phone">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="checkout-phone"
                            type="tel"
                            placeholder="01xxxxxxxxx"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 pr-36 h-11 rounded-xl"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
                            Egyptian numbers only
                          </span>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
              {/* Green Header Bar */}
              <div className="bg-[#16a34a] px-6 py-4 text-white">
                <div className="flex items-center gap-2.5 font-bold text-base">
                  <CreditCard className="w-4 h-4" />
                  <h2>Payment Method</h2>
                </div>
                <p className="text-xs text-white/85 mt-0.5">
                  Choose how you&apos;d like to pay
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Option 1: Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-[#16a34a] bg-[#f0fdf4]/50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === "cash"
                          ? "bg-[#16a34a] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          paymentMethod === "cash"
                            ? "text-[#15803d]"
                            : "text-[#1e293b]"
                        }`}
                      >
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Pay when your order arrives at your doorstep
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      paymentMethod === "cash"
                        ? "bg-[#16a34a] text-white"
                        : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {paymentMethod === "cash" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                </button>

                {/* Option 2: Pay Online (Stripe) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    paymentMethod === "online"
                      ? "border-[#16a34a] bg-[#f0fdf4]/50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === "online"
                          ? "bg-[#16a34a] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          paymentMethod === "online"
                            ? "text-[#15803d]"
                            : "text-[#1e293b]"
                        }`}
                      >
                        Pay Online
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Secure payment with Credit/Debit Card via Stripe
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-700 text-white text-[9px] font-extrabold tracking-wider">
                          VISA
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-extrabold tracking-wider">
                          MC
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white text-[9px] font-extrabold tracking-wider">
                          AMEX
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      paymentMethod === "online"
                        ? "bg-[#16a34a] text-white"
                        : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                </button>

                {/* Secure & Encrypted Info Box */}
                <div className="rounded-xl bg-[#f0fdf4] border border-[#dcfce7] p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#15803d]">
                      Secure & Encrypted
                    </h4>
                    <p className="text-[11px] text-[#16a34a]">
                      Your payment info is protected with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary Card ── */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_6px_24px_rgba(0,0,0,0.04)] overflow-hidden sticky top-24">
              {/* Green Header Bar */}
              <div className="bg-[#16a34a] px-5 py-4 text-white">
                <div className="flex items-center gap-2 font-bold text-base">
                  <ShoppingBag className="w-4 h-4" />
                  <h2>Order Summary</h2>
                </div>
                <p className="text-xs text-white/85 mt-0.5">
                  {totalUnits} {totalUnits === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="p-5">
                {/* Scrollable Items Preview */}
                {isLoading ? (
                  <div className="space-y-3 mb-4">
                    <div className="h-14 rounded-xl skeleton-shimmer" />
                    <div className="h-14 rounded-xl skeleton-shimmer" />
                  </div>
                ) : (
                  <div className="max-h-[250px] overflow-y-auto space-y-2.5 pr-1 mb-4 border-b border-gray-100 pb-4">
                    {cartProducts.map((item) => {
                      const prod = item.product;
                      const pid = prod?._id || prod?.id || item._id;
                      return (
                        <div
                          key={pid}
                          className="bg-gray-50/80 rounded-xl p-2.5 flex items-center justify-between gap-3 border border-gray-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-white border border-gray-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={prod?.imageCover}
                                alt={prod?.title}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1e293b] truncate max-w-[135px]">
                                {prod?.title}
                              </p>
                              <p className="text-[11px] text-[#64748b]">
                                {item.count} × {item.price} EGP
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-extrabold text-[#1e293b] shrink-0">
                            {item.count * item.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subtotal & Shipping */}
                <div className="space-y-2.5 text-xs sm:text-sm border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1e293b]">
                      {totalCartPrice.toLocaleString()} EGP
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="inline-flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                      <span>Shipping</span>
                    </span>
                    {shippingCost === 0 ? (
                      <span className="font-bold text-[#16a34a]">FREE</span>
                    ) : (
                      <span className="font-bold text-[#1e293b]">
                        {shippingCost} EGP
                      </span>
                    )}
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex items-baseline justify-between mb-5">
                  <span className="text-base font-extrabold text-[#1e293b]">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#16a34a]">
                      {finalTotal.toLocaleString()}
                    </span>{" "}
                    <span className="text-xs font-semibold text-[#64748b]">
                      EGP
                    </span>
                  </div>
                </div>

                {/* Place Order Submit Button */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Place Order</span>
                    </>
                  )}
                </Button>

                {/* Bottom Trust Badges */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#64748b]">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>Secure</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fast Delivery</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-orange-500" />
                    <span>Easy Returns</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
