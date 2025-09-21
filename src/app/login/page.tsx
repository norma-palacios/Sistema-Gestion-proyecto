"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

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
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
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
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
              </div>
            )}

            <div>
              <Label>Correo</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
            </div>

            {mode === "register" && (
              <div>
                <Label>Rol</Label>
                <Select value={role} onChange={(e) => setRole(e.target.value as "gerente" | "usuario")}>
                  <option value="usuario">Usuario</option>
                  <option value="gerente">Gerente</option>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </Button>
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

          <div className="mt-6 text-xs text-[rgb(var(--muted-foreground))] space-y-1">
            <p className="font-semibold text-[rgb(var(--foreground))]">Usuarios de prueba:</p>
            <p>Gerente: rachels.saenz@hotmail.com / 123456</p>
            <p>Usuario: norma.palacios@hotmail.com / 123456</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


