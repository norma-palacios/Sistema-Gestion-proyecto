"use client";

import { useEffect, useMemo, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/context/AuthContext";
import { TasksApi } from "@/lib/tasks";
import { ProjectsApi } from "@/lib/projects";
import type { Task, TaskStatus, Project } from "@/lib/types";

const statuses: TaskStatus[] = ["pendiente", "en-progreso", "hecha"];

export default function TareasPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // formulario de creación (sólo gerente)
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [assignedTo, setAssignedTo] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [pjs, tsks] = await Promise.all([
        ProjectsApi.list(),
        user?.role === "gerente" ? TasksApi.list() : TasksApi.list({ assignedTo: user!.id }),
      ]);
      setProjects(pjs);
      setTasks(tsks);
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title.trim() || !projectId || !assignedTo) return;
    await TasksApi.create({
      title: title.trim(),
      projectId,
      assignedTo,
      status: "pendiente",
      id: 0, // no se usa, json-server lo asigna
    } as any);
    setTitle(""); setProjectId(null); setAssignedTo(null);
    await load();
  };

  const updateStatus = async (id: number, status: TaskStatus) => {
    await TasksApi.update(id, { status });
    await load();
  };

  const remove = async (id: number) => {
    await TasksApi.remove(id);
    await load();
  };

  const projectName = useMemo(
    () => Object.fromEntries(projects.map(p => [p.id, p.name] as const)),
    [projects]
  );

  return (
    <PrivateRoute>
      <main className="min-h-screen p-6 space-y-6">
        <h1 className="text-2xl font-bold">Tareas</h1>
        {err && <div className="text-sm text-red-600">{err}</div>}

        <RoleGate allow={["gerente"]}>
          <div className="border rounded-xl p-4 space-y-2">
            <h2 className="font-semibold">Nueva tarea</h2>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Título"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-2">
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={projectId ?? ""}
                onChange={e => setProjectId(Number(e.target.value))}
              >
                <option value="">Proyecto…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Asignar a (userId)"
                type="number"
                value={assignedTo ?? ""}
                onChange={e => setAssignedTo(Number(e.target.value))}
              />
            </div>
            <button onClick={create} className="rounded-lg bg-black text-white px-3 py-2">Crear</button>
          </div>
        </RoleGate>

        <div className="grid gap-3">
          {loading ? (
            <p className="text-sm opacity-70">Cargando…</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm opacity-70">No hay tareas.</p>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="border rounded-xl p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-70">
                    Proyecto: {projectName[t.projectId] ?? t.projectId} • Asignado a: {t.assignedTo}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value as any)}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <RoleGate allow={["gerente"]}>
                    <button className="text-sm underline" onClick={() => remove(t.id)}>
                      Eliminar
                    </button>
                  </RoleGate>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-xs opacity-60">
          Usuarios pueden ver sus tareas y actualizar el <b>estado</b>. El gerente ve todas y puede crear/eliminar.
        </p>
      </main>
    </PrivateRoute>
  );
}

