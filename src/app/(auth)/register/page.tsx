"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Star,
  Truck,
  ShieldCheck,
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { RegisterFormValues } from "@/api/types";
import {
  signUpUser,
  DEFAULT_AUTH_TOKEN,
  setAuthTokenCookie,
  setLoggedUserCookie,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import { registerSchema } from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = getLoggedUserFromCookies();
    if (user) {
      router.replace("/");
    }
  }, [router]);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const watchedPassword = form.watch("password") || "";

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "Weak", width: "w-0", color: "bg-gray-200" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) {
      return { label: "Weak", width: "w-1/3", color: "bg-red-500" };
    }
    if (score === 2) {
      return { label: "Medium", width: "w-2/3", color: "bg-amber-500" };
    }
    return { label: "Strong", width: "w-full", color: "bg-[#0aad0a]" };
  };

  const strength = getPasswordStrength(watchedPassword);

  const onSubmit = async (values: RegisterFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    if (!agreedTerms) {
      setTermsError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    setTermsError(null);

    try {
      const { ok, data } = await signUpUser(values);
      if (!ok) {
        setApiError(
          data.errors?.msg ||
            data.message ||
            "Failed to create account. Please try again."
        );
        return;
      }

      if (typeof window !== "undefined") {
        setAuthTokenCookie(data.token || DEFAULT_AUTH_TOKEN);
        if (data.user) {
          setLoggedUserCookie(data.user);
        }
        window.dispatchEvent(new Event("auth-change"));
      }

      setApiSuccess("Account created successfully! Welcome to FreshCart...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setApiError(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f9fbfa] py-6 sm:py-14 px-3 sm:px-4">
      <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ── Left Column: Welcome & Value Props (Desktop Only) ── */}
        <div className="hidden lg:block lg:col-span-6 lg:pr-4 pt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c2c34] tracking-tight mb-3">
            Welcome to <span className="text-[#16a34a]">FreshCart</span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748b] leading-relaxed mb-8 max-w-lg">
            Join thousands of happy customers who enjoy fresh groceries delivered
            right to their doorstep.
          </p>

          {/* 3 Feature Rows */}
          <div className="space-y-6 mb-9">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                <Star className="w-5 h-5 fill-[#16a34a]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e293b]">
                  Premium Quality
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                  Premium quality products sourced from trusted suppliers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e293b]">
                  Fast Delivery
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                  Same-day delivery available in most areas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e293b]">
                  Secure Shopping
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                  Your data and payments are completely secure
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] max-w-lg">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] border border-[#16a34a]/20 flex items-center justify-center text-[#16a34a] font-bold text-sm shrink-0">
                SJ
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1e293b]">
                  Sarah Johnson
                </h4>
                <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm italic text-[#64748b] leading-relaxed">
              &ldquo;FreshCart has transformed my shopping experience. The quality
              of the products is outstanding, and the delivery is always on time.
              Highly recommend!&rdquo;
            </p>
          </div>
        </div>

        {/* ── Right Column: Create Your Account Form Card ── */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-[26px] font-bold text-[#1e293b]">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Start your fresh journey with us today
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4 rounded-lg border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-[#1e293b] cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
                  />
                </svg>
                <span>Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-10 px-4 rounded-lg border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-[#1e293b] cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 font-medium">
                or
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* API Alerts */}
            {apiError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{apiError}</span>
              </div>
            )}

            {apiSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16a34a]" />
                <span>{apiSuccess}</span>
              </div>
            )}

            {/* Form Using Shadcn Controller, Label, Input & Button */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FieldGroup>
                {/* 1. Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="register-name">Name*</Label>
                      <Input
                        {...field}
                        id="register-name"
                        type="text"
                        placeholder="Ali"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* 2. Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="register-email">Email*</Label>
                      <Input
                        {...field}
                        id="register-email"
                        type="email"
                        placeholder="ali@example.com"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* 3. Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="register-password">Password*</Label>
                      <div className="relative">
                        <Input
                          {...field}
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="create a strong password"
                          aria-invalid={fieldState.invalid}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label="Toggle password visibility"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Bar */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength.width} ${strength.color}`}
                          />
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {strength.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Must be at least 6 characters with numbers and symbols
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* 4. Confirm Password (rePassword) */}
                <Controller
                  name="rePassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="register-rePassword">
                        Confirm Password*
                      </Label>
                      <div className="relative">
                        <Input
                          {...field}
                          id="register-rePassword"
                          type={showRePassword ? "text" : "password"}
                          placeholder="confirm your password"
                          aria-invalid={fieldState.invalid}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword((prev) => !prev)}
                          aria-label="Toggle confirm password visibility"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showRePassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* 5. Phone Number */}
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="register-phone">Phone Number*</Label>
                      <Input
                        {...field}
                        id="register-phone"
                        type="tel"
                        placeholder="01012345678"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Terms Checkbox */}
              <div>
                <Label
                  htmlFor="register-terms"
                  className="font-normal text-[#475569] cursor-pointer"
                >
                  <input
                    id="register-terms"
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (e.target.checked) setTermsError(null);
                    }}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#16a34a] hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#16a34a] hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>{" "}
                    *
                  </span>
                </Label>
                {termsError && (
                  <p className="text-xs text-red-500 mt-1">{termsError}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create My Account</span>
                  </>
                )}
              </Button>
            </form>

            {/* Bottom Sign In Link */}
            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs sm:text-sm text-[#64748b]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#16a34a] font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
