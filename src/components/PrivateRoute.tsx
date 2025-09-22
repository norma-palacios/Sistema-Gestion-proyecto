"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-sm text-[rgb(var(--muted-foreground))]">Cargando…</div>;
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
