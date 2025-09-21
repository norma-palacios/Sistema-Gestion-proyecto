"use client";
import { useId, useState } from "react";
import Image from "next/image";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`card overflow-hidden ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-[rgb(var(--card))] hover:bg-[rgba(0,0,0,.02)]"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-medium">{title}</span>
        <Image src={isOpen ? "/up-arrow.svg" : "/down-arrow.svg"} alt="" width={20} height={20} aria-hidden />
      </button>

      <div className="h-px bg-[rgb(var(--border))]" />

      <div
        id={panelId}
        className={`transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}