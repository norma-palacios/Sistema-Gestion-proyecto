import { api } from "@/lib/api";
import { Role } from "./types";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const UsersApi = {
  list: async (params?: Partial<User>) =>
    (await api.get<User[]>("/users", { params })).data,
};