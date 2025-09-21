import React from "react";

type Tone = "projects" | "tasks" | "none";
const toneBg: Record<Tone, string> = {
  projects: "from-[rgb(var(--projects-50))]",
  tasks: "from-[rgb(var(--tasks-50))]",
  none: "from-transparent",
};

export function PageHeader({
  title,
  description,
  actions,
  tone = "none",
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`mb-6 rounded-2xl p-4 border bg-gradient-to-r ${toneBg[tone]} to-transparent
                  border-[rgb(var(--border))] flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className ?? ""}`}
    >
      <div>
        <h1 className="text-2xl font-semibold m-0">{title}</h1>
        {description && <p className="text-sm mt-1" style={{ color: "rgb(var(--muted-foreground))" }}>{description}</p>}
      </div>
      {actions}
    </div>
  );
}
