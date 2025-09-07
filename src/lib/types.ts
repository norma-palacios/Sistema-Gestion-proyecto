export type Role = "gerente" | "usuario";

export type Project = {
  id: number;
  name: string;
  description?: string;
  // opcional: quiénes participan
  members?: number[]; // ids de users
};

export type TaskStatus = "pendiente" | "en-progreso" | "hecha";

export type Task = {
  id: number;
  projectId: number;
  title: string;
  status: TaskStatus;
  assignedTo: number; // user id
};
