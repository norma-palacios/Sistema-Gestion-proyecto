"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/context/AuthContext";
import { ProjectsApi } from "@/lib/projects";
import type { Project } from "@/lib/types";

export default function ProyectosPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [proyectoId, setProyectoId] = useState<number | null>(null);
  const [edicionActiva, setEdicionActiva] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await ProjectsApi.list());
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    await ProjectsApi.create({
      name: name.trim(),
      description: desc.trim() || undefined,
      members: [],
    });
    setName("");
    setDesc("");
    await load();
  };

  const remove = async (id: number) => {
    await ProjectsApi.remove(id);
    await load();
  };

  const activarEdicion = (proyecto: Project) => {
    setEdicionActiva(true);
    setProyectoId(proyecto.id);
    setName(proyecto.name);
    setDesc(proyecto.description || "");
  };

  const editar = async (
    idProyecto: number | null,
    nombre: string,
    descripcion: string
  ) => {
    if (idProyecto != null) {
      const p: Project = {
        id: idProyecto,
        name: nombre,
        description: descripcion,
      };
      await ProjectsApi.update(idProyecto, p);
      setName("");
      setDesc(""); 
      setEdicionActiva(false);
      await load();
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6 space-y-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <RoleGate allow={["gerente"]}>
          <div className="border rounded-xl p-4 space-y-2">
            <h2 className="font-semibold">Nuevo proyecto</h2>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Descripción (opcional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            {edicionActiva ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => editar(proyectoId, name, desc)}
                  className="rounded-lg bg-black text-white px-3 py-2"
                >
                  Editar
                </button>

                <button
                  onClick={() => setEdicionActiva(false)}
                  className="rounded-lg bg-black text-white px-3 py-2"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={create}
                className="rounded-lg bg-black text-white px-3 py-2"
              >
                Crear
              </button>
            )}
          </div>
        </RoleGate>

        {!edicionActiva && (
          <div className="grid gap-3">
            {loading ? (
              <p className="text-sm opacity-70">Cargando…</p>
            ) : items.length === 0 ? (
              <p className="text-sm opacity-70">No hay proyectos.</p>
            ) : (
              items.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    {p.description && (
                      <div className="text-sm opacity-70">{p.description}</div>
                    )}
                  </div>
                  <RoleGate allow={["gerente"]}>
                    <div className="flex flex-col space-y-2">
                      <button
                        className="text-sm underline"
                        onClick={() => remove(p.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="text-sm underline"
                        onClick={() => activarEdicion(p)}
                      >
                        Editar
                      </button>
                    </div>
                  </RoleGate>
                </div>
              ))
            )}
          </div>
        )}

        <p className="text-xs opacity-60">
          Tu rol: <b>{user?.role}</b>. Los usuarios sólo visualizan; el gerente
          puede crear/eliminar.
        </p>
      </main>
    </PrivateRoute>
  );
}
