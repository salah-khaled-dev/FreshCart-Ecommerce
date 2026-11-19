"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  Plus,
  Trash2,
  Phone,
  Building2,
  Home,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { AddressItem, AddAddressFormValues } from "@/api/types";
import {
  getLoggedUserAddresses,
  addUserAddress,
  removeUserAddress,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import { addAddressSchema } from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export default function AddressesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const form = useForm<AddAddressFormValues>({
    defaultValues: {
      name: "",
      city: "",
      details: "",
      phone: "",
    },
    resolver: zodResolver(addAddressSchema),
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
        const data = await getLoggedUserAddresses();
        if (isMounted) {
          setAddresses(data);
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

  const onAddAddressSubmit = async (values: AddAddressFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await addUserAddress(values);
      if (!ok) {
        setApiError(data.message || "Failed to add address. Please try again.");
        return;
      }

      if (Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        const refreshed = await getLoggedUserAddresses();
        setAddresses(refreshed);
      }

      form.reset();
      setApiSuccess(data.message || "Address added successfully!");
      setTimeout(() => setApiSuccess(null), 3000);
    } catch {
      setApiError("Network error occurred while adding address.");
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    if (removingId) return;
    setApiError(null);
    setApiSuccess(null);
    setRemovingId(addressId);

    try {
      const { ok, data } = await removeUserAddress(addressId);
      if (!ok) {
        setApiError(data.message || "Failed to remove address.");
        return;
      }

      if (Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        setAddresses((prev) => prev.filter((item) => item._id !== addressId));
      }

      setApiSuccess(data.message || "Address removed successfully!");
      setTimeout(() => setApiSuccess(null), 3000);
    } catch {
      setApiError("Network error occurred while removing address.");
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
           Please Login First
          </h1>
          <p className="text-sm text-[#64748b] leading-relaxed mb-6">
            Please login to your account to view and manage your delivery addresses or add a new address.
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
            <li className="font-semibold text-[#1c2c34]">My Addresses</li>
          </ol>
        </nav>

        {/* ── 2. Section Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-[#16a34a] rounded-full" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2c34]">
                  Delivery <span className="text-[#16a34a]">Addresses</span>
                </h1>
                {!isLoading && (
                  <span className="text-xs font-bold text-[#16a34a] bg-[#e8fadf] border border-[#16a34a]/25 px-3 py-1 rounded-full">
                    {addresses.length}{" "}
                    {addresses.length === 1 ? "Address" : "Addresses"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Manage your shipping addresses for faster checkout
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {apiSuccess && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span>{apiSuccess}</span>
          </div>
        )}

        {/* ── 3. Main Content: Add Form (Left) + Saved Addresses List (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add New Address Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#e8fadf] text-[#16a34a] flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1c2c34]">
                    Add New Address
                  </h2>
                  <p className="text-xs text-[#64748b]">
                    Enter your delivery location details
                  </p>
                </div>
              </div>

              <form
                onSubmit={form.handleSubmit(onAddAddressSubmit)}
                className="space-y-4"
                noValidate
              >
                <FieldGroup>
                  {/* 1. Address Label (name) */}
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="address-name">
                          Address Label (e.g. Home, Work)*
                        </Label>
                        <div className="relative">
                          <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="address-name"
                            type="text"
                            placeholder="Home"
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

                  {/* 2. City */}
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="address-city">City*</Label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="address-city"
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

                  {/* 3. Street & Building Details */}
                  <Controller
                    name="details"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="address-details">
                          Street & Building Details*
                        </Label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="address-details"
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

                  {/* 4. Phone Number */}
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="address-phone">Phone Number*</Label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="address-phone"
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

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save Address</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Saved Addresses Grid */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3"
                  >
                    <div className="h-5 w-1/3 rounded-md skeleton-shimmer" />
                    <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
                    <div className="h-4 w-1/2 rounded-md skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isRemoving = removingId === addr._id;
                  return (
                    <div
                      key={addr._id}
                      className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(10,173,10,0.1)] hover:border-[#16a34a]/50 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] bg-[#e8fadf] px-3 py-1 rounded-full">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{addr.name}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveAddress(addr._id)}
                            disabled={isRemoving}
                            aria-label="Delete address"
                            title="Delete address"
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isRemoving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <p className="text-sm font-bold text-[#1e293b] mb-1">
                          {addr.city}
                        </p>
                        <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-4">
                          {addr.details}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-[#475569] font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>{addr.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
                <div className="w-16 h-16 rounded-full bg-[#e8fadf] text-[#16a34a] flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1c2c34] mb-1.5">
                  No Saved Addresses Yet
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] max-w-sm mx-auto">
                  Use the form on the left to add your home or work delivery
                  address for faster checkout.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
