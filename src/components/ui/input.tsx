import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-[#1e293b] shadow-2xs transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:border-[#16a34a] focus-visible:ring-3 focus-visible:ring-[#16a34a]/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-red-500/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
