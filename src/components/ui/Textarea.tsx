import React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full min-h-[90px] rounded-xl border bg-[rgb(var(--surface))] px-3 py-2 text-sm",
        "border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted-foreground))]",
        "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--ring))]",
        className
      )}
    />
  );
}
