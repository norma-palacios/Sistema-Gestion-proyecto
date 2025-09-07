import { api } from "@/lib/api";
import { Task } from "./types";

export const TasksApi = {
  list: async (params?: Partial<Task>) => (await api.get<Task[]>("/tasks", { params })).data,
  create: async (t: Omit<Task, "id">) => (await api.post<Task>("/tasks", t)).data,
  update: async (id: number, t: Partial<Task>) => (await api.patch<Task>(`/tasks/${id}`, t)).data,
  remove: async (id: number) => { await api.delete(`/tasks/${id}`); },
};
