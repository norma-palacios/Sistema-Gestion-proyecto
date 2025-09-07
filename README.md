## Entrega – Raquel Saenz (rama `rachel/auth`)

### Implementación
- Registro e inicio de sesión con validación básica.
- Sesión almacenada en `localStorage`.
- Rutas protegidas con `AuthContext` (`isAuthenticated`).
- Roles:
  - **Gerente**: crea/gestiona proyectos y tareas.
  - **Usuario**: ve proyectos asignados y actualiza estado de tareas.
- UI condicionada por rol (mismas pantallas, opciones visibles según permisos).

### Endpoints (JSON Server)
- `GET http://localhost:4000/users`
- `GET/POST http://localhost:4000/projects`
- `GET/POST http://localhost:4000/tasks`

### Variables de entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
