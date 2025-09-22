import React from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center bg-[rgb(var(--surface))]">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
