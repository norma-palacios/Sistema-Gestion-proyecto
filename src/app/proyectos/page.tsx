"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/context/AuthContext";
import { ProjectsApi } from "@/lib/projects";
import type { Project } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

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

  const activarEdicion = (p: Project) => {
    setEdicionActiva(true);
    setProyectoId(p.id);
    setName(p.name);
    setDesc(p.description || "");
  };

  const editar = async (id: number | null, nombre: string, descripcion: string) => {
    if (id != null) {
      await ProjectsApi.update(id, { id, name: nombre, description: descripcion });
      setName("");
      setDesc("");
      setEdicionActiva(false);
      await load();
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6 space-y-6">
        <PageHeader title="Proyectos" description="Organiza y prioriza tus proyectos" />
        {err && <div className="text-sm text-red-600">{err}</div>}

        <RoleGate allow={["gerente"]}>
          <Card>
            <CardHeader>
              <CardTitle>{edicionActiva ? "Editar proyecto" : "Nuevo proyecto"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Descripción (opcional)</Label>
                <Textarea
                  placeholder="Descripción..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {edicionActiva ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => editar(proyectoId, name, desc)}
                  >
                    Guardar cambios
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEdicionActiva(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={create}>
                  Crear
                </Button>
              )}
            </CardContent>
          </Card>
        </RoleGate>

        {!edicionActiva &&
          (loading ? (
            <p className="text-sm opacity-70">Cargando…</p>
          ) : items.length === 0 ? (
            <EmptyState
              title="No hay proyectos"
              description="Crea tu primer proyecto para empezar."
            />
          ) : (
            <div className="grid gap-3">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="card p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    {p.description && (
                      <div className="text-sm opacity-70">{p.description}</div>
                    )}
                  </div>
                  <RoleGate allow={["gerente"]}>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => activarEdicion(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(p.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </RoleGate>
                </div>
              ))}
            </div>
          ))}

        <p className="text-xs opacity-60">
          Tu rol: <b>{user?.role}</b>. Los usuarios sólo visualizan; el gerente puede
          crear/eliminar.
        </p>
      </main>
    </PrivateRoute>
  );
}
