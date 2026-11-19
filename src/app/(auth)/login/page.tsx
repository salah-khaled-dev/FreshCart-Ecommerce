"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
  Clock,
  Users,
  Star,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  LoginFormValues,
  ForgotPasswordFormValues,
  VerifyResetCodeFormValues,
  ResetPasswordFormValues,
} from "@/api/types";
import {
  signInUser,
  forgotPasswordUser,
  verifyResetCodeUser,
  resetPasswordUser,
  DEFAULT_AUTH_TOKEN,
  setAuthTokenCookie,
  setLoggedUserCookie,
  getLoggedUserFromCookies,
} from "@/api/services/routemisr.service";
import {
  loginSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [authView, setAuthView] = useState<
    "login" | "forgot" | "verify" | "reset"
  >("login");
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = getLoggedUserFromCookies();
    if (user) {
      router.replace("/");
    }
  }, [router]);

  // 1. Login Form
  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // 2. Forgot Password Form (POST /api/v1/auth/forgotPasswords)
  const forgotForm = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  // 3. Verify Reset Code Form (POST /api/v1/auth/verifyResetCode)
  const verifyForm = useForm<VerifyResetCodeFormValues>({
    defaultValues: {
      resetCode: "",
    },
    resolver: zodResolver(verifyResetCodeSchema),
    mode: "onTouched",
  });

  // 4. Reset Password Form (PUT /api/v1/auth/resetPassword)
  const resetForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: "",
      newPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await signInUser(values);
      if (!ok) {
        setApiError(
          data.errors?.msg || data.message || "Incorrect email or password."
        );
        return;
      }

      if (typeof window !== "undefined") {
        const cookieDays = keepSignedIn ? 30 : 7;
        setAuthTokenCookie(data.token || DEFAULT_AUTH_TOKEN, cookieDays);
        if (data.user) {
          setLoggedUserCookie(data.user, cookieDays);
        }
        window.dispatchEvent(new Event("auth-change"));
      }

      setApiSuccess("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 900);
    } catch {
      setApiError(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  const onForgotSubmit = async (values: ForgotPasswordFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await forgotPasswordUser(values);
      if (!ok) {
        setApiError(
          data.message || "Could not find an account with that email address."
        );
        return;
      }

      resetForm.setValue("email", values.email);
      setApiSuccess(
        data.message || "Reset code sent to your email! Enter the code below."
      );
      setAuthView("verify");
    } catch {
      setApiError(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  const onVerifySubmit = async (values: VerifyResetCodeFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await verifyResetCodeUser(values);
      if (!ok) {
        setApiError(data.message || "Invalid or expired reset code.");
        return;
      }

      setApiSuccess("Code verified! Please enter your new password.");
      setAuthView("reset");
    } catch {
      setApiError("Network error occurred while verifying code.");
    }
  };

  const onResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await resetPasswordUser(values);
      if (!ok) {
        setApiError(
          data.errors?.msg ||
            data.message ||
            "Failed to reset password. Make sure your reset code was verified first."
        );
        return;
      }

      if (typeof window !== "undefined") {
        setAuthTokenCookie(data.token || DEFAULT_AUTH_TOKEN);
        window.dispatchEvent(new Event("auth-change"));
      }

      setApiSuccess("Password reset successfully! Redirecting to home...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setApiError("Network error occurred while resetting password.");
    }
  };

  const handleSwitchToForgot = () => {
    setApiError(null);
    setApiSuccess(null);
    const currentEmail = loginForm.getValues("email");
    if (currentEmail) {
      forgotForm.setValue("email", currentEmail);
      resetForm.setValue("email", currentEmail);
    }
    setAuthView("forgot");
  };

  return (
    <main className="min-h-screen bg-[#f9fbfa] py-6 sm:py-16 px-3 sm:px-4 flex items-center">
      <div className="max-w-[1140px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* ── Left Column: Illustration & Highlights (Desktop Only) ── */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center text-center">
          {/* Shopping Cart with Fresh Produce Illustration Card */}
          <div className="w-full max-w-[440px] rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 mb-7 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#dcfce7]/50 rounded-bl-full pointer-events-none" />
            <svg
              viewBox="0 0 360 260"
              className="w-full max-w-[310px] h-auto drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="185" cy="240" rx="95" ry="10" fill="#E2E8F0" />
              <path
                d="M140 85C130 55 148 35 162 52C170 30 192 38 184 65Z"
                fill="#22C55E"
              />
              <path
                d="M210 88C215 52 245 36 250 65C268 48 282 68 258 92Z"
                fill="#16A34A"
              />
              <path
                d="M118 65L148 135L125 140L106 72C105 67 114 61 118 65Z"
                fill="#FB923C"
              />
              <rect
                x="105"
                y="92"
                width="65"
                height="26"
                rx="13"
                transform="rotate(28 105 92)"
                fill="#15803D"
              />
              <rect
                x="145"
                y="74"
                width="48"
                height="52"
                rx="16"
                fill="#EF4444"
              />
              <path
                d="M169 74C169 65 175 62 178 65"
                stroke="#15803D"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="212" cy="118" r="24" fill="#FACC15" />
              <circle cx="192" cy="96" r="14" fill="#7E22CE" />
              <circle cx="152" cy="148" r="22" fill="#F97316" />
              <circle cx="196" cy="154" r="20" fill="#EF4444" />
              <circle cx="232" cy="146" r="22" fill="#FB923C" />
              <path
                d="M225 110C245 105 268 118 255 135C240 148 215 132 225 110Z"
                fill="#DC2626"
              />
              <path
                d="M65 82H95L124 184H246"
                stroke="#94A3B8"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="56"
                y="76"
                width="26"
                height="11"
                rx="5.5"
                fill="#EF4444"
              />
              <path
                d="M96 96H276L250 174H122L96 96Z"
                stroke="#CBD5E1"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <line
                x1="104"
                y1="116"
                x2="269"
                y2="116"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="136"
                x2="262"
                y2="136"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="116"
                y1="156"
                x2="255"
                y2="156"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="136"
                y1="96"
                x2="146"
                y2="174"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="172"
                y1="96"
                x2="175"
                y2="174"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="208"
                y1="96"
                x2="204"
                y2="174"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <line
                x1="244"
                y1="96"
                x2="232"
                y2="174"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M134 184L118 222H242L228 184"
                stroke="#94A3B8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="132" cy="228" r="12" fill="#1E293B" />
              <circle cx="132" cy="228" r="5" fill="#CBD5E1" />
              <circle cx="232" cy="228" r="12" fill="#1E293B" />
              <circle cx="232" cy="228" r="5" fill="#CBD5E1" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e293b] max-w-md leading-snug mb-3">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-md leading-relaxed mb-6">
            Join thousands of happy customers who trust FreshCart for their daily
            grocery needs
          </p>

          {/* 3 Mini Perks Row */}
          <div className="flex items-center justify-center flex-wrap gap-5 text-xs text-[#64748b] font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#16a34a]" />
              <span>Free Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <span>Secure Payment</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#16a34a]" />
              <span>24/7 Support</span>
            </span>
          </div>
        </div>

        {/* ── Right Column: Sign In / Forgot & Reset Password Card ── */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-9 shadow-[0_10px_35px_rgba(0,0,0,0.05)] max-w-lg mx-auto w-full">
            {/* Brand Title & Welcome */}
            <div className="text-center mb-6">
              <div className="text-2xl font-extrabold tracking-tight mb-2">
                <span className="text-[#16a34a]">Fresh</span>
                <span className="text-[#1e293b]">Cart</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b]">
                {authView === "login" && "Welcome Back!"}
                {authView === "forgot" && "Forgot Password?"}
                {authView === "verify" && "Verify Reset Code"}
                {authView === "reset" && "Reset Password"}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                {authView === "login" &&
                  "Sign in to continue your fresh shopping experience"}
                {authView === "forgot" &&
                  "Enter your email to receive a password reset code"}
                {authView === "verify" &&
                  "Enter the 6-digit verification code sent to your email"}
                {authView === "reset" &&
                  "Enter your email and set your new password"}
              </p>
            </div>

            {authView === "login" ? (
              <>
                {/* Stacked Social Buttons */}
                <div className="space-y-2.5 mb-5">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 px-4 rounded-lg border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-[#1e293b] cursor-pointer"
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
                    <span>Continue with Google</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 px-4 rounded-lg border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-[#1e293b] cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-[#1877F2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Continue with Facebook</span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-5">
                  <div className="border-t border-gray-200 w-full" />
                  <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-gray-400 font-semibold whitespace-nowrap">
                    OR CONTINUE WITH EMAIL
                  </span>
                  <div className="border-t border-gray-200 w-full" />
                </div>
              </>
            ) : (
              /* Visual Progress Stepper for Password Recovery Flow */
              <div className="flex items-center justify-between mb-6 px-3">
                {[
                  { id: "forgot", num: 1, label: "Email" },
                  { id: "verify", num: 2, label: "Verify Code" },
                  { id: "reset", num: 3, label: "New Password" },
                ].map((step, idx) => {
                  const currentStepNum =
                    authView === "forgot" ? 1 : authView === "verify" ? 2 : 3;
                  const isDone = currentStepNum > step.num;
                  const isCurrent = currentStepNum === step.num;

                  return (
                    <React.Fragment key={step.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setApiError(null);
                          setApiSuccess(null);
                          if (step.id === "reset") {
                            const emailVal =
                              forgotForm.getValues("email") ||
                              loginForm.getValues("email");
                            if (emailVal) resetForm.setValue("email", emailVal);
                          }
                          setAuthView(
                            step.id as "forgot" | "verify" | "reset"
                          );
                        }}
                        className="flex flex-col items-center gap-1.5 cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? "bg-[#16a34a] text-white"
                              : isCurrent
                              ? "bg-[#dcfce7] text-[#16a34a] ring-2 ring-[#16a34a]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : step.num}
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${
                            isCurrent || isDone
                              ? "text-[#1e293b]"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </button>

                      {idx < 2 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 -mt-4 rounded-full transition-colors ${
                            currentStepNum > step.num
                              ? "bg-[#16a34a]"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

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

            {/* ── View 1: Sign In Form (Shadcn Controller, Label, Input, Button) ── */}
            {authView === "login" && (
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
                noValidate
              >
                <FieldGroup>
                  <Controller
                    name="email"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="login-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            aria-invalid={fieldState.invalid}
                            className="pl-10"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={loginForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Password</Label>
                          <button
                            type="button"
                            onClick={handleSwitchToForgot}
                            className="text-xs font-semibold text-[#16a34a] hover:underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 pr-10"
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
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div>
                  <Label
                    htmlFor="login-keep-signed-in"
                    className="font-normal text-[#475569] cursor-pointer"
                  >
                    <input
                      id="login-keep-signed-in"
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <span>Keep me signed in</span>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {loginForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>
            )}

            {/* ── View 2: Forgot Password Form (POST /api/v1/auth/forgotPasswords) ── */}
            {authView === "forgot" && (
              <form
                onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                className="space-y-4"
                noValidate
              >
                <Controller
                  name="email"
                  control={forgotForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          {...field}
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your registered email"
                          aria-invalid={fieldState.invalid}
                          className="pl-10"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={forgotForm.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {forgotForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Reset Code...</span>
                    </>
                  ) : (
                    <span>Send Reset Code</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setApiError(null);
                    setApiSuccess(null);
                    setAuthView("login");
                  }}
                  className="w-full h-10 rounded-lg border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#475569] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Button>
              </form>
            )}

            {/* ── View 3: Verify Reset Code Form (POST /api/v1/auth/verifyResetCode) ── */}
            {authView === "verify" && (
              <form
                onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
                className="space-y-4"
                noValidate
              >
                <Controller
                  name="resetCode"
                  control={verifyForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label
                        htmlFor="verify-resetCode"
                        className="justify-center"
                      >
                        Enter the 6-Digit Verification Code
                      </Label>
                      <Input
                        {...field}
                        id="verify-resetCode"
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        aria-invalid={fieldState.invalid}
                        className="h-12 text-center text-lg font-bold tracking-[0.4em]"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-center"
                        />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={verifyForm.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {verifyForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setApiError(null);
                    setApiSuccess(null);
                    setAuthView("login");
                  }}
                  className="w-full h-10 rounded-lg border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#475569] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Button>
              </form>
            )}

            {/* ── View 4: Reset Password Form (PUT /api/v1/auth/resetPassword) ── */}
            {authView === "reset" && (
              <form
                onSubmit={resetForm.handleSubmit(onResetPasswordSubmit)}
                className="space-y-4"
                noValidate
              >
                <FieldGroup>
                  <Controller
                    name="email"
                    control={resetForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="reset-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            aria-invalid={fieldState.invalid}
                            className="pl-10"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="newPassword"
                    control={resetForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Label htmlFor="reset-newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            {...field}
                            id="reset-newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label="Toggle new password visibility"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            {showNewPassword ? (
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
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={resetForm.formState.isSubmitting}
                  className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {resetForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setApiError(null);
                    setApiSuccess(null);
                    setAuthView("login");
                  }}
                  className="w-full h-10 rounded-lg border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#475569] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Button>
              </form>
            )}

            {/* Footer Links & Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs sm:text-sm text-[#64748b] mb-4">
                New to FreshCart?{" "}
                <Link
                  href="/register"
                  className="text-[#16a34a] font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </p>

              <div className="flex items-center justify-center flex-wrap gap-4 text-[11px] text-[#64748b]">
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-gray-500" />
                  <span>SSL Secured</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span>50K+ Users</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 Rating</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
