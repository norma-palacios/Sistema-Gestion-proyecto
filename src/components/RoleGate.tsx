"use client";
import { useAuth } from "@/context/AuthContext";

export default function RoleGate({
  allow,
  children,
}: { allow: ("gerente" | "usuario")[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  return allow.includes(user.role) ? <>{children}</> : null;
}



