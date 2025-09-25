"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import RoleGate from "@/components/RoleGate";
import { ProjectsApi } from "@/lib/projects";
import { TasksApi } from "@/lib/tasks";
import Collapsible from "@/components/Collapsible";
import type { Task, TaskStatus, Project } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Select } from "@/components/ui/Select";

const statuses: TaskStatus[] = ["pendiente", "en-progreso", "hecha"];

export default function PanelPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tareasMap, setTareasMap] = useState<Map<string, Task[]>>(new Map());

  const updateStatus = async (id: number, status: TaskStatus) => {
    await TasksApi.update(id, { status });
    await load();
  };

  const load = async () => {
    try {
      const [prj, tsks] = await Promise.all([
        ProjectsApi.list(),
        TasksApi.list(),
      ]);
      const proyectosMap = new Map<number, string>();
      prj.forEach((p: Project) => proyectosMap.set(p.id, p.name));

      const map = new Map<string, Task[]>();
      const tareasAsignadas = tsks.filter((item) => item.assignedTo === user?.id);
      tareasAsignadas.forEach((tarea: Task) => {
        const proyectoNombre = proyectosMap.get(tarea.projectId) ?? "Sin proyecto";
        if (!map.has(proyectoNombre)) map.set(proyectoNombre, []);
        map.get(proyectoNombre)!.push(tarea);
      });
      setTareasMap(map);
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load();
  }, [user]);

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6 space-y-6">
        <PageHeader
          title="Panel"
          description={user?.role === "gerente" ? "Accesos rápidos para gestión" : "Tus proyectos y tareas asignadas"}
          actions={
            <div className="text-sm">
              <span className="mr-3 opacity-70">
                Sesión: {user?.name} ({user?.role})
              </span>
              <Button type="button" size="sm" variant="secondary" onClick={logout}>
                Salir
              </Button>
            </div>
          }
        />

        <RoleGate allow={["gerente"]}>
          <section className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Proyectos"
              description="Crea, edita o consulta proyectos."
              href="/proyectos"
              action={<Button type="button" variant="secondary">Ir a Proyectos</Button>}
            />
            <StatCard
              title="Tareas"
              description="Gestiona y actualiza el estado de tareas."
              href="/tareas"
              action={<Button type="button" variant="secondary">Ir a Tareas</Button>}
            />
          </section>
        </RoleGate>

        <RoleGate allow={["usuario"]}>
          <p className="text-xl mb-2 font-bold">Proyectos asignados</p>
          {Array.from(tareasMap.entries()).map(([proyecto, tareas]) => (
            <div className="mt-2" key={proyecto}>
              <Collapsible title={proyecto}>
                {tareas.map((t) => (
                  <div
                    key={t.id}
                    className="card p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs opacity-70">
                        Proyecto: {proyecto} • Asignado a: {t.assignedTo}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Estado</span>
                      <Select
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value as any)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))}
              </Collapsible>
            </div>
          ))}
        </RoleGate>
      </main>
    </PrivateRoute>
  );
}
