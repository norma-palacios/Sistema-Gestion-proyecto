"use client";

import { useEffect, useMemo, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import RoleGate from "@/components/RoleGate";
import { useAuth } from "@/context/AuthContext";
import { TasksApi } from "@/lib/tasks";
import { ProjectsApi } from "@/lib/projects";
import { UsersApi } from "@/lib/users";
import type { Task, TaskStatus, Project, Role } from "@/lib/types";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

const statuses: TaskStatus[] = ["pendiente", "en-progreso", "hecha"];

export default function TareasPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const [pjs, tsks, usrs] = await Promise.all([
        ProjectsApi.list(),
        user.role === "gerente"
          ? TasksApi.list()
          : TasksApi.list({ assignedTo: user.id }),
        UsersApi.list({ role: "usuario" }),
      ]);

      setProjects(pjs);
      setTasks(tsks);
      setUsers(usrs);
    } catch {
      setErr("Error de red");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load();
  }, [user]);

  const create = async () => {
    if (!title.trim() || !projectId || !assignedTo) return;

    await TasksApi.create({
      title: title.trim(),
      projectId: Number(projectId),
      assignedTo: Number(assignedTo),
      status: "pendiente",
    });

    setTitle("");
    setProjectId("");
    setAssignedTo("");
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

  const userName = useMemo(
    () => Object.fromEntries(users.map(u => [u.id, u.name] as const)),
    [users]
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
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
              >
                <option value="">Selecciona un proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
              >
                <option value="">Asignar a usuario</option>
                {users.map(u => (
                  <option key={u.id} value={String(u.id)}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={create}
              className="rounded-lg bg-violet-600 text-white px-3 py-2"
            >
              Crear
            </button>
          </div>
        </RoleGate>

        <div className="grid gap-3">
          {loading ? (
            <p className="text-sm opacity-70">Cargando…</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm opacity-70">No hay tareas.</p>
          ) : (
            tasks.map(t => (
              <div
                key={t.id}
                className="border rounded-xl p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-70">
                    Proyecto: {projectName[t.projectId] ?? t.projectId} •
                    Asignado a: {userName[t.assignedTo] ?? t.assignedTo}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={t.status}
                    onChange={(e) =>
                      updateStatus(t.id, e.target.value as TaskStatus)
                    }
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <RoleGate allow={["gerente"]}>
                    <button
                      className="text-sm underline text-violet-600"
                      onClick={() => remove(t.id)}
                    >
                      Eliminar
                    </button>
                  </RoleGate>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-xs opacity-60">
          Los usuarios pueden ver sus tareas y cambiar el <b>estado</b>. El gerente puede ver todas, crearlas y eliminarlas.
        </p>
      </main>
    </PrivateRoute>
  );
}