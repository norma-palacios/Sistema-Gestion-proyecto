"use client";
import { useAuth } from "@/context/AuthContext";

export default function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: ("gerente" | "usuario")[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return null;
  return allow.includes(user.role) ? <>{children}</> : <>{fallback}</>;
}
