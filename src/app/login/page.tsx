"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"gerente" | "usuario">("usuario");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register({ name: name.trim(), email: email.trim(), password, role });
      }
      router.replace("/panel");
    } catch (err: any) {
      setError(err?.message ?? "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Usa los datos de prueba o crea usuario nuevo.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
                value={role}
                onChange={(e) => setRole(e.target.value as "gerente" | "usuario")}
              >
                <option value="usuario">Usuario</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button className="underline" onClick={() => { setMode("register"); setError(null); }}>
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button className="underline" onClick={() => { setMode("login"); setError(null); }}>
                Inicia sesión
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-600 space-y-1">
          <p className="font-semibold">Usuarios de prueba:</p>
          <p>Gerente: rachels.saenz@hotmail.com / 123456</p>
          <p>Usuario: norma.palacios@hotmail.com / 123456</p>
        </div>
      </div>
    </main>
  );
}


