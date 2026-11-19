"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  X,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Check,
  MapPin,
  Package,
} from "lucide-react";
import {
  AuthUser,
  UpdateProfileFormValues,
  ChangePasswordFormValues,
  ForgotPasswordFormValues,
  VerifyResetCodeFormValues,
  ResetPasswordFormValues,
} from "@/api/types";
import {
  updateUserProfile,
  changeUserPassword,
  forgotPasswordUser,
  verifyResetCodeUser,
  resetPasswordUser,
  DEFAULT_AUTH_TOKEN,
  setAuthTokenCookie,
  setLoggedUserCookie,
} from "@/api/services/routemisr.service";
import {
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from "@/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

interface UserProfileMenuProps {
  user: AuthUser;
  onLogout: () => void;
  onUserUpdated: (updated: AuthUser) => void;
}

export default function UserProfileMenu({
  user,
  onLogout,
  onUserUpdated,
}: UserProfileMenuProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form 1: Update Profile (PUT /api/v1/users/updateMe/)
  const profileForm = useForm<UpdateProfileFormValues>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: "",
    },
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
  });

  // Form 2: Change Password (PUT /api/v1/users/changeMyPassword)
  const passwordForm = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  // Form 3A: Send Reset Code (POST /api/v1/auth/forgotPasswords)
  const forgotForm = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: user.email || "",
    },
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  // Form 3B: Verify Reset Code (POST /api/v1/auth/verifyResetCode)
  const verifyForm = useForm<VerifyResetCodeFormValues>({
    defaultValues: {
      resetCode: "",
    },
    resolver: zodResolver(verifyResetCodeSchema),
    mode: "onTouched",
  });

  // Form 3C: Reset Password (PUT /api/v1/auth/resetPassword)
  const resetPwdForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: user.email || "",
      newPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const targetResetEmail = resetPwdForm.watch("email");

  useEffect(() => {
    profileForm.reset({
      name: user.name || "",
      email: user.email || "",
      phone: "",
    });
    forgotForm.reset({
      email: user.email || "",
    });
    resetPwdForm.reset({
      email: user.email || "",
      newPassword: "",
    });
  }, [user, profileForm, forgotForm, resetPwdForm]);

  const openModal = (tab: "profile" | "password") => {
    setApiError(null);
    setApiSuccess(null);
    setIsResetMode(false);
    setResetStep(1);
    setActiveTab(tab);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleProfileSubmit = async (values: UpdateProfileFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await updateUserProfile(values);
      if (!ok) {
        setApiError(
          data.errors?.msg ||
            data.message ||
            "Failed to update profile. Make sure the email is not already in use."
        );
        return;
      }

      const updatedUser: AuthUser = {
        name: data.user?.name || values.name,
        email: data.user?.email || values.email,
        role: data.user?.role || user.role || "user",
      };

      if (typeof window !== "undefined") {
        setLoggedUserCookie(updatedUser);
        window.dispatchEvent(new Event("auth-change"));
      }

      onUserUpdated(updatedUser);
      setApiSuccess("Profile updated successfully!");
    } catch {
      setApiError("Network error occurred while updating profile.");
    }
  };

  const handlePasswordSubmit = async (values: ChangePasswordFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await changeUserPassword(values);
      if (!ok) {
        setApiError(
          data.errors?.msg ||
            data.message ||
            "Failed to change password. Please verify your current password."
        );
        return;
      }

      if (typeof window !== "undefined") {
        setAuthTokenCookie(data.token || DEFAULT_AUTH_TOKEN);
      }

      passwordForm.reset();
      setApiSuccess("Password changed successfully!");
    } catch {
      setApiError("Network error occurred while changing password.");
    }
  };

  const handleSendResetCodeSubmit = async (values: ForgotPasswordFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await forgotPasswordUser(values);
      if (!ok) {
        setApiError(
          data.message || "Could not send reset code to this email address."
        );
        return;
      }

      resetPwdForm.setValue("email", values.email);
      setApiSuccess("Verification code sent to your email!");
      setResetStep(2);
    } catch {
      setApiError("Network error occurred while sending reset code.");
    }
  };

  const handleVerifyResetCodeSubmit = async (
    values: VerifyResetCodeFormValues
  ) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await verifyResetCodeUser(values);
      if (!ok) {
        setApiError(data.message || "Invalid or expired verification code.");
        return;
      }

      verifyForm.reset();
      setApiSuccess("Code verified! Enter your new password below.");
      setResetStep(3);
    } catch {
      setApiError("Network error occurred while verifying code.");
    }
  };

  const handleResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const { ok, data } = await resetPasswordUser(values);
      if (!ok) {
        setApiError(
          data.errors?.msg ||
            data.message ||
            "Failed to reset password. Make sure the reset code was verified."
        );
        return;
      }

      if (typeof window !== "undefined") {
        setAuthTokenCookie(data.token || DEFAULT_AUTH_TOKEN);
        window.dispatchEvent(new Event("auth-change"));
      }

      resetPwdForm.reset({ email: values.email, newPassword: "" });
      setApiSuccess("Password reset successfully!");
      setTimeout(() => {
        setIsResetMode(false);
        setResetStep(1);
      }, 1200);
    } catch {
      setApiError("Network error occurred while resetting password.");
    }
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    onLogout();
    router.push("/login");
  };

  const initials = (user.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Trigger Pill in Navbar ── */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="h-[40px] pl-1.5 pr-3.5 bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#16a34a]/30 text-[#1c2c34] text-[13px] font-semibold rounded-full flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span className="w-7 h-7 rounded-full bg-[#16a34a] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
          <span className="max-w-[115px] truncate hidden sm:inline">
            {user.name}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#16a34a] transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ── Dropdown Menu ── */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8fadf] text-[#16a34a] font-bold text-sm flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#1c2c34] truncate">
                  {user.name}
                </p>
                {user.email ? (
                  <p className="text-xs text-[#64748b] truncate">{user.email}</p>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#16a34a] font-medium">
                    <UserCheck className="w-3 h-3" />
                    Verified Account
                  </span>
                )}
              </div>
            </div>

            {/* Menu Actions */}
            <div className="py-1.5 px-1.5 space-y-0.5">
              <button
                type="button"
                onClick={() => openModal("profile")}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-[#334155] hover:bg-[#e8fadf]/60 hover:text-[#16a34a] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#16a34a]" />
                <span>Update Profile</span>
              </button>

              <Link
                href="/addresses"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-[#334155] hover:bg-[#e8fadf]/60 hover:text-[#16a34a] flex items-center gap-2.5 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#16a34a]" />
                <span>My Addresses</span>
              </Link>

              <Link
                href="/allorders"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-[#334155] hover:bg-[#e8fadf]/60 hover:text-[#16a34a] flex items-center gap-2.5 transition-colors"
              >
                <Package className="w-4 h-4 text-[#16a34a]" />
                <span>All Orders</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="pt-1.5 mt-1 px-1.5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User Settings Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#16a34a] to-[#16a34a] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-base">
                  {initials}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight">
                    {user.name}
                  </h3>
                  <p className="text-xs text-white/80">
                    Account Settings & Security
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clean 2-Tab Navigation Bar */}
            <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setApiError(null);
                  setApiSuccess(null);
                  setIsResetMode(false);
                  setActiveTab("profile");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-[#16a34a] shadow-xs border border-gray-200/70"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Update Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setApiError(null);
                  setApiSuccess(null);
                  setActiveTab("password");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "password"
                    ? "bg-white text-[#16a34a] shadow-xs border border-gray-200/70"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Password & Security</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
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

              {/* ── TAB 1: Update Profile (Shadcn Controller, Label, Input, Button) ── */}
              {activeTab === "profile" && (
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FieldGroup>
                    <Controller
                      name="name"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Label htmlFor="profile-name">Full Name*</Label>
                          <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="profile-name"
                              type="text"
                              placeholder="Your full name"
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
                      name="email"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Label htmlFor="profile-email">Email Address*</Label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="profile-email"
                              type="email"
                              placeholder="newemail@example.com"
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
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Label htmlFor="profile-phone">Phone Number*</Label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="profile-phone"
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
                    disabled={profileForm.formState.isSubmitting}
                    className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {profileForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Profile...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                </form>
              )}

              {/* ── TAB 2A: Change Password (PUT /api/v1/users/changeMyPassword) ── */}
              {activeTab === "password" && !isResetMode && (
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FieldGroup>
                    <Controller
                      name="currentPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="pwd-current">
                              Current Password*
                            </Label>
                            <button
                              type="button"
                              onClick={() => {
                                setApiError(null);
                                setApiSuccess(null);
                                setResetStep(1);
                                setIsResetMode(true);
                              }}
                              className="text-xs font-semibold text-[#16a34a] hover:underline cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="pwd-current"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              aria-invalid={fieldState.invalid}
                              className="pl-10 pr-10 rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword((p) => !p)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showCurrentPassword ? (
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

                    <Controller
                      name="password"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Label htmlFor="pwd-new">New Password*</Label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="pwd-new"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              aria-invalid={fieldState.invalid}
                              className="pl-10 pr-10 rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword((p) => !p)}
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

                    <Controller
                      name="rePassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Label htmlFor="pwd-confirm">
                            Confirm New Password*
                          </Label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                              {...field}
                              id="pwd-confirm"
                              type={showRePassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              aria-invalid={fieldState.invalid}
                              className="pl-10 pr-10 rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRePassword((p) => !p)}
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
                  </FieldGroup>

                  <Button
                    type="submit"
                    disabled={passwordForm.formState.isSubmitting}
                    className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </Button>
                </form>
              )}

              {/* ── TAB 2B: Clean 3-Step Password Reset Wizard ── */}
              {activeTab === "password" && isResetMode && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setApiError(null);
                        setApiSuccess(null);
                        setIsResetMode(false);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#1e293b] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Change Password</span>
                    </button>

                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#e8fadf] px-2.5 py-0.5 rounded-full">
                      Step {resetStep} of 3
                    </span>
                  </div>

                  {/* Visual Progress Stepper */}
                  <div className="flex items-center justify-between mb-6 px-2">
                    {[
                      { num: 1, label: "Email" },
                      { num: 2, label: "Verify Code" },
                      { num: 3, label: "New Password" },
                    ].map((step, idx) => {
                      const isDone = resetStep > step.num;
                      const isCurrent = resetStep === step.num;
                      return (
                        <React.Fragment key={step.num}>
                          <button
                            type="button"
                            onClick={() => {
                              setApiError(null);
                              setApiSuccess(null);
                              setResetStep(step.num as 1 | 2 | 3);
                            }}
                            className="flex flex-col items-center gap-1.5 group cursor-pointer"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? "bg-[#16a34a] text-white"
                                  : isCurrent
                                  ? "bg-[#e8fadf] text-[#16a34a] ring-2 ring-[#16a34a]"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : step.num}
                            </div>
                            <span
                              className={`text-[11px] font-semibold ${
                                isCurrent || isDone
                                  ? "text-[#1c2c34]"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </button>

                          {idx < 2 && (
                            <div
                              className={`flex-1 h-0.5 mx-2 -mt-4 rounded-full transition-colors ${
                                resetStep > step.num
                                  ? "bg-[#16a34a]"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Step 1: Send Reset Code (POST /api/v1/auth/forgotPasswords) */}
                  {resetStep === 1 && (
                    <form
                      onSubmit={forgotForm.handleSubmit(
                        handleSendResetCodeSubmit
                      )}
                      className="space-y-4"
                      noValidate
                    >
                      <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3.5 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#64748b] leading-relaxed">
                          We will send a 6-digit verification code to your email
                          to reset your password.
                        </p>
                      </div>

                      <Controller
                        name="email"
                        control={forgotForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="modal-forgot-email">
                              Registered Email Address*
                            </Label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <Input
                                {...field}
                                id="modal-forgot-email"
                                type="email"
                                placeholder="Enter your email"
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

                      <Button
                        type="submit"
                        disabled={forgotForm.formState.isSubmitting}
                        className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {forgotForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Code...</span>
                          </>
                        ) : (
                          <span>Send Verification Code</span>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Step 2: Verify Reset Code (POST /api/v1/auth/verifyResetCode) */}
                  {resetStep === 2 && (
                    <form
                      onSubmit={verifyForm.handleSubmit(
                        handleVerifyResetCodeSubmit
                      )}
                      className="space-y-4"
                      noValidate
                    >
                      <Controller
                        name="resetCode"
                        control={verifyForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Label
                              htmlFor="modal-verify-code"
                              className="justify-center"
                            >
                              Enter the 6-Digit Verification Code
                            </Label>
                            <Input
                              {...field}
                              id="modal-verify-code"
                              type="text"
                              maxLength={6}
                              placeholder="• • • • • •"
                              aria-invalid={fieldState.invalid}
                              className="h-12 rounded-xl text-center text-lg font-bold tracking-[0.4em]"
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
                        className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                    </form>
                  )}

                  {/* Step 3: Set New Password (PUT /api/v1/auth/resetPassword) */}
                  {resetStep === 3 && (
                    <form
                      onSubmit={resetPwdForm.handleSubmit(
                        handleResetPasswordSubmit
                      )}
                      className="space-y-4"
                      noValidate
                    >
                      {targetResetEmail ? (
                        <div className="bg-[#f0fdf4] border border-[#16a34a]/20 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                          <span className="text-[#64748b]">Account:</span>
                          <span className="font-semibold text-[#1c2c34]">
                            {targetResetEmail}
                          </span>
                        </div>
                      ) : (
                        <Controller
                          name="email"
                          control={resetPwdForm.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <Label htmlFor="modal-reset-email">
                                Email Address*
                              </Label>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <Input
                                  {...field}
                                  id="modal-reset-email"
                                  type="email"
                                  placeholder="Enter your email"
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
                      )}

                      <Controller
                        name="newPassword"
                        control={resetPwdForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="modal-reset-newPassword">
                              New Password*
                            </Label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <Input
                                {...field}
                                id="modal-reset-newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                aria-invalid={fieldState.invalid}
                                className="pl-10 pr-10 rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword((p) => !p)}
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

                      <Button
                        type="submit"
                        disabled={resetPwdForm.formState.isSubmitting}
                        className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {resetPwdForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving New Password...</span>
                          </>
                        ) : (
                          <span>Save New Password</span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Modal Footer with Logout */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
