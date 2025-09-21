import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
}

interface TaskListProps {
  projectId: number;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Leer tareas del proyecto
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks?projectId=${projectId}`);
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch {
      setError("Error cargando tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [API_URL, projectId]);

  // Agregar tarea
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false, projectId }),
      });
      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask("");
      setError("");
    } catch {
      setError("No se pudo agregar la tarea");
    }
  };

  // Eliminar tarea
  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task.id !== id));
      setError("");
    } catch {
      setError("No se pudo eliminar la tarea");
    }
  };

  // Marcar tarea como completada
  const toggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      setError("");
    } catch {
      setError("No se pudo actualizar la tarea");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h3>Lista de Tareas</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          style={{ padding: "5px", width: "70%" }}
        />
        <button onClick={addTask} style={{ padding: "5px 10px", marginLeft: "5px" }}>
          Agregar
        </button>
      </div>

      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "5px" }}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                marginRight: "10px",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => toggleComplete(task)} style={{ marginRight: "5px" }}>
              {task.completed ? "↺" : "✔"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
          </li>
        ))
