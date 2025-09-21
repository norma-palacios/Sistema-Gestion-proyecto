import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";

interface Project {
  id: number;
  title: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Leer proyectos
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProjects(data);
      setError("");
    } catch {
      setError("Error cargando proyectos");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Agregar proyecto
  const addProject = async () => {
    if (!newProject.trim()) return;
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newProject }),
      });
      const project = await res.json();
      setProjects([...projects, project]);
      setNewProject("");
    } catch {
      setError("No se pudo agregar el proyecto");
    }
  };

  // Eliminar proyecto
  const deleteProject = async (id: number) => {
    try {
      await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
      if (selectedProjectId === id) setSelectedProjectId(null);
    } catch {
      setError("No se pudo eliminar el proyecto");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Proyectos</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Nuevo proyecto"
          style={{ padding: "5px", width: "70%" }}
        />
        <button onClick={addProject} style={{ padding: "5px 10px", marginLeft: "5px" }}>
          Agregar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((project) => (
          <li key={project.id} style={{ marginBottom: "5px" }}>
            <span
              onClick={() => setSelectedProjectId(project.id)}
              style={{
                cursor: "pointer",
                fontWeight: selectedProjectId === project.id ? "bold" : "normal",
              }}
            >
              {project.title}
            </span>
            <button
              onClick={() => deleteProject(project.id)}
              style={{ marginLeft: "10px" }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {selectedProjectId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Tareas del proyecto</h3>
          <TaskList projectId={selectedProjectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectList;
