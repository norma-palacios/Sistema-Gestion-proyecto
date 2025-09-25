"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api"; // <- usa tu instancia axios y .env

type Role = "gerente" | "usuario";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "sessionUser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hidrata sesión desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.get("/users", { params: { email, password } });
      const data: any[] = Array.isArray(res.data) ? res.data : [];
      const found = data[0];
      if (!found) {
        throw new Error("Credenciales inválidas");
      }
      const u: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role as Role,
      };
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch (err: any) {
      if (err?.message === "Credenciales inválidas") throw err;
      throw new Error("Error de red");
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      // Evita duplicados por email
      const exists = await api.get("/users", { params: { email: input.email } });
      if (Array.isArray(exists.data) && exists.data.length > 0) {
        throw new Error("Ese correo ya está registrado");
      }

      const res = await api.post("/users", input);
      const created = res.data;
      const u: User = {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role as Role,
      };
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch (err: any) {
      if (err?.message?.includes("registrado")) throw err;
      throw new Error("No se pudo registrar");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}



