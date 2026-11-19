"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function Field({
  className,
  ...props
}: React.ComponentProps<"div"> & { "data-invalid"?: boolean }) {
  return (
    <div
      data-slot="field"
      className={cn("group/field flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group-data-[invalid=true]/field:text-red-500",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-[11px] text-gray-400", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  errors,
  children,
  ...props
}: React.ComponentProps<"p"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const message =
    children ?? errors?.find((err) => err?.message)?.message ?? null

  if (!message) return null

  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-xs font-medium text-red-500 mt-0.5", className)}
      {...props}
    >
      {message}
    </p>
  )
}

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError }
