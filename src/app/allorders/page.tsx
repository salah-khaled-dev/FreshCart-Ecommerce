"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Home,
  ChevronRight,
  Banknote,
  CreditCard,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { OrderItem } from "@/api/types";
import {
  getAllOrders,
  getUserOrders,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";

export default function AllOrdersPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<"user" | "all">("user");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const fetcher = viewMode === "user" ? getUserOrders() : getAllOrders();
        const data = await fetcher;
        if (isMounted) {
          setOrders(data);
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
  }, [viewMode]);

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
           Please Login First 
          </h1>
          <p className="text-sm text-[#64748b] leading-relaxed mb-6">
            Please login to your account to view and track your order history and shipping details.
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
            <li className="font-semibold text-[#1c2c34]">All Orders</li>
          </ol>
        </nav>

        {/* ── 2. Section Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
                  All <span className="text-[#16a34a]">Orders</span>
                </h1>
                {!isLoading && (
                  <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-3 py-1 rounded-full">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Track and review all placed orders and their delivery status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Toggle: User Orders vs All Orders */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/70">
              <button
                type="button"
                onClick={() => {
                  if (viewMode !== "user") {
                    setIsLoading(true);
                    setViewMode("user");
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "user"
                    ? "bg-white text-[#16a34a] shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  if (viewMode !== "all") {
                    setIsLoading(true);
                    setViewMode("all");
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "all"
                    ? "bg-white text-[#16a34a] shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Orders
              </button>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#16a34a] bg-[#e8fadf]/60 hover:bg-[#e8fadf] px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── 3. Loading Skeleton ── */}
        {isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-40 rounded-md skeleton-shimmer" />
                  <div className="h-6 w-24 rounded-full skeleton-shimmer-green" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="h-20 rounded-xl skeleton-shimmer" />
                  <div className="h-20 rounded-xl skeleton-shimmer" />
                  <div className="h-20 rounded-xl skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          /* ── 4. Orders List ── */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-emerald-200 transition-all"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center flex-wrap gap-4 sm:gap-6">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-semibold block">
                        Order ID
                      </span>
                      <span className="text-sm font-extrabold text-[#1c2c34]">
                        #{order.id || order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {order.createdAt && (
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-semibold block">
                          Date Placed
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#334155] inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#16a34a]" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {order.user?.name && (
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-semibold block">
                          Customer
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#334155] inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#16a34a]" />
                          {order.user.name}
                        </span>
                      </div>
                    )}

                    {order.shippingAddress?.city && (
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-semibold block">
                          Destination
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#334155] inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
                          {order.shippingAddress.city}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Badges & Total Price */}
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-[#334155] capitalize">
                      {order.paymentMethodType === "card" ? (
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-[#16a34a]" />
                      )}
                      {order.paymentMethodType || "cash"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        order.isPaid
                          ? "bg-[#e8fadf] text-[#16a34a]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.isPaid ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {order.isPaid ? "Paid" : "Pay on Delivery"}
                    </span>

                    <div className="pl-2 text-right">
                      <span className="text-[11px] text-[#64748b] block">
                        Total Amount
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-[#16a34a]">
                        {order.totalOrderPrice} EGP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items Grid */}
                {order.cartItems && order.cartItems.length > 0 && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.cartItems.map((item) => {
                      const prod = item.product;
                      const prodId = prod?._id || prod?.id || item._id;
                      return (
                        <Link
                          key={item._id || prodId}
                          href={`/productdetails/${prodId}`}
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 hover:border-[#16a34a]/40 hover:bg-gray-50/50 transition-all"
                        >
                          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={prod?.imageCover}
                              alt={prod?.title || "Product"}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#1e293b] line-clamp-1 mb-1">
                              {prod?.title || "Product Item"}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-[#64748b]">
                              <span>Qty: {item.count}</span>
                              <span className="font-bold text-[#16a34a]">
                                {item.price} EGP
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ── 5. Empty Orders State ── */
          <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-lg mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2c34] mb-2">
              No Orders Found
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-7">
              There are no orders to display right now. Place an order from your
              shopping cart to see it here!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-sm transition-all"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
