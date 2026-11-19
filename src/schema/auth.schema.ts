import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name cannot exceed 40 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(6, "Please confirm your password"),
    phone: z
      .string()
      .regex(
        /^01[0125][0-9]{8}$/,
        "Enter a valid Egyptian phone number (e.g. 01012345678)"
      ),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const verifyResetCodeSchema = z.object({
  resetCode: z
    .string()
    .min(4, "Please enter the reset code sent to your email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^01[0125][0-9]{8}$/,
      "Enter a valid Egyptian phone number (e.g. 01012345678)"
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    rePassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "New passwords do not match",
    path: ["rePassword"],
  });

export const addAddressSchema = z.object({
  name: z
    .string()
    .min(2, "Address label is required (e.g. Home, Work)")
    .max(30, "Label is too long"),
  city: z
    .string()
    .min(2, "City is required (e.g. Cairo, Giza)")
    .max(40, "City name is too long"),
  details: z
    .string()
    .min(4, "Please enter street and building details")
    .max(120, "Details are too long"),
  phone: z
    .string()
    .regex(
      /^01[0125][0-9]{8}$/,
      "Enter a valid Egyptian phone number (e.g. 01012345678)"
    ),
});

export const createReviewSchema = z.object({
  review: z
    .string()
    .min(3, "Review must be at least 3 characters")
    .max(300, "Review cannot exceed 300 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

export const shippingAddressSchema = z.object({
  city: z
    .string()
    .min(2, "City is required (e.g. Cairo, Giza)")
    .max(40, "City name is too long"),
  details: z
    .string()
    .min(4, "Please enter street and building details")
    .max(120, "Details are too long"),
  phone: z
    .string()
    .regex(
      /^01[0125][0-9]{8}$/,
      "Enter a valid Egyptian phone number (e.g. 01012345678)"
    ),
});



