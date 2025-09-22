import React from "react";

export function Select({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${className}`}
    />
  );
}