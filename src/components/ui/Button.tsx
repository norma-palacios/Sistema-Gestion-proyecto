import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      type = "button",
      children,
      ...rest
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:brightness-110",
      secondary: "bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] hover:bg-white/5",
      ghost: "text-[rgb(var(--foreground))] hover:bg-white/5 border border-transparent",
      danger: "bg-[rgb(var(--danger))] text-white hover:brightness-110",
      success: "bg-[rgb(var(--success))] text-white hover:brightness-110",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? "Cargando…" : children}
      </button>
    );
  }
);

Button.displayName = "Button";
