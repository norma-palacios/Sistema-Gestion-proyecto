import React from "react";

type Tone = "projects" | "tasks" | "none";

export function StatCard({
  title,
  description,
  href,
  action,
  tone = "none",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  href?: string;
  action?: React.ReactNode;
  tone?: Tone;
}) {
  const toneVar =
    tone === "projects"
      ? "var(--projects-600)"
      : tone === "tasks"
      ? "var(--tasks-600)"
      : "var(--border)";

  const content = (
    <div
      className={`card p-5 h-full border-l-4 ${className ?? ""}`}
      style={{ ["--tone" as any]: toneVar, borderLeftColor: "rgb(var(--tone))" }}
      {...rest}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="text-sm" style={{ color: "rgb(var(--muted-foreground))" }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );

  return href ? <a href={href} className="block">{content}</a> : content;
}
