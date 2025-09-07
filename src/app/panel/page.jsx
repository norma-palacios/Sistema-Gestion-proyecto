"use client";

import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function PanelPage() {
  const { user, logout } = useAuth();

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Panel</h1>
          <div className="text-sm">
            <span className="mr-3 opacity-70">Sesión: {user?.name} ({user?.role})</span>
            <button
              onClick={logout}
              className="underline"
            >
              Salir
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link href="/proyectos" className="border rounded-xl p-4 hover:bg-gray-50">
            <h2 className="font-semibold mb-1">Proyectos</h2>
            <p className="text-sm opacity-70">Crea, edita o consulta proyectos.</p>
          </Link>

          <Link href="/tareas" className="border rounded-xl p-4 hover:bg-gray-50">
            <h2 className="font-semibold mb-1">Tareas</h2>
            <p className="text-sm opacity-70">Gestiona y actualiza el estado de tareas.</p>
          </Link>
        </section>
      </main>
    </PrivateRoute>
  );
}



