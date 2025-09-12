"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import RoleGate from "@/components/RoleGate";
import { ProjectsApi } from "@/lib/projects";
import { TasksApi } from "@/lib/tasks";
import Collapsible from "@/components/Collapsible";
import type {Task, TaskStatus, Project} from "@/lib/types"

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
        TasksApi.list({ assignedTo: user?.id }),
       ]); 
      const proyectosMap = new Map<number, string>();
      prj.forEach((p: Project) => {
        proyectosMap.set(p.id, p.name);
      });

      // 3️⃣ Agrupar tareas por nombre de proyecto
      const map = new Map<string, Task[]>();

      const tareasAsignadas = tsks.filter(item => item.assignedTo === user?.id)

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

   useEffect(() => { load(); }, []);

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Panel</h1>
          <div className="text-sm">
            <span className="mr-3 opacity-70">
              Sesión: {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="underline">
              Salir
            </button>
          </div>
        </header>

        <RoleGate allow={["gerente"]}>
          <section className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/proyectos"
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              <h2 className="font-semibold mb-1">Proyectos</h2>
              <p className="text-sm opacity-70">
                Crea, edita o consulta proyectos.
              </p>
            </Link>

            <Link
              href="/tareas"
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              <h2 className="font-semibold mb-1">Tareas</h2>
              <p className="text-sm opacity-70">
                Gestiona y actualiza el estado de tareas.
              </p>
            </Link>
          </section>
        </RoleGate>
        <RoleGate allow={["usuario"]}>
          <p className="text-xl mb-2 font-bold">Proyectos asignados</p>
          {Array.from(tareasMap.entries()).map(([proyecto, tareas]) => (
            <div className="mt-2" key={proyecto}>
                <Collapsible title={proyecto}>
              {tareas.map((t) => (
                  <div key={t.id} className="border rounded-xl p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs opacity-70">
                          Proyecto: {proyecto} • Asignado a: {t.assignedTo}
                        </div>
                      </div>
      
                      <div className="flex items-center gap-2">
                        <p>Estado</p>
                        <select
                          className="border rounded-lg px-2 py-1 text-sm"
                          value={t.status}
                          onChange={(e) => updateStatus(t.id, e.target.value as any)}
                          >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
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


