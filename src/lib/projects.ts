import { api } from "@/lib/api";
import { Project } from "./types";

export const ProjectsApi = {
  list: async () => (await api.get<Project[]>("/projects")).data,
  create: async (p: Omit<Project, "id">) => (await api.post<Project>("/projects", p)).data,
  update: async (id: number, p: Partial<Project>) => (await api.patch<Project>(`/projects/${id}`, p)).data,
  remove: async (id: number) => { await api.delete(`/projects/${id}`); },
};
