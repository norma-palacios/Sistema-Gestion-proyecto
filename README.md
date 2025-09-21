# Sistema de Gestión de Proyectos y Tareas

## 📌 Descripción

Esta aplicación permite gestionar **proyectos** y sus **tareas asociadas**.  
Cada proyecto puede tener múltiples tareas, las cuales se pueden:

- Crear
- Eliminar
- Marcar como completadas

El sistema está construido con **Next.js**, **TypeScript**, y un **backend REST** alojado en Render.

---
## Implementación

- CRUD básico para proyectos y tareas.

- Estado manejado con useState, useEffect y hooks personalizados.

- Sesión almacenada en localStorage.

- Rutas protegidas con AuthContext (isAuthenticated).

**- Roles:**

         - Gerente: crea/gestiona proyectos y tareas.

         - Usuario: ve proyectos asignados y actualiza estado de tareas.

         - Interfaz condicionada por rol (mismas pantallas, opciones visibles según permisos).

## 📁 Estructura del proyecto

src/
 ├─ app/
 │   ├─ components/
 │   │   ├─ Collapsible.tsx
 │   │   ├─ PrivateRoute.tsx
 │   │   ├─ RoleGate.tsx
 │   │   ├─ TaskList.tsx        <-- CRUD de tareas
 │   │   ├─ ProjectList.tsx     <-- CRUD de proyectos
 │
 ├─ context/
 ├─ lib/

 
---

## ⚙️ Requisitos

- Node.js >= 18
- npm >= 9

---
## Endpoints 
- `GET/POST https://backend-ja1a.onrender.com/users`
- `GET/POST https://backend-ja1a.onrender.com/projects`
- `GET/POST https://backend-ja1a.onrender.com/tasks`



## 🖥️ Cómo ejecutar localmente (Frontend)

1. Clona el repositorio:

```bash
git clone https://github.com/norma-palacios/Sistema-Gestion-proyecto.git
cd Sistema-Gestion-proyecto
```
2. Instala dependencias:
```bash
  npm install
```

3. Crea un archivo .env.local en la raíz del proyecto con la URL del backend:
```
  NEXT_PUBLIC_API_URL=https://backend-ja1a.onrender.com
```
4. Inicia la aplicación:
```
  npm run dev
```
5. Abre en el navegador:
```
   http://localhost:3000
```
 ### Despliegue:
  - Frontend (Vercel): https://sistema-gestion-proyecto.vercel.app/login
  - Backend (Render): https://backend-ja1a.onrender.com

Notas:
- La variable de entorno NEXT_PUBLIC_API_URL permite cambiar la URL del backend. 
- La UI y funcionalidades se adaptan segun el rol del usuario.

### Repositorio del Backend
- https://github.com/Bry070319/backend.git

### Repositorio desplegado en vercel
- https://github.com/Bry070319/Sistema-Gestion-proyecto.git

### Capturas
- Login
<img width="750" height="750" alt="image" src="https://github.com/user-attachments/assets/a5711dd2-4590-4cbb-adb3-a804d418017e" />

- Panel Gerente
<img width="750" height="750" alt="image" src="https://github.com/user-attachments/assets/efffe65b-55ec-45b3-8d33-4a484568e999" />

- Proyectos
<img width="750" height="750" alt="image" src="https://github.com/user-attachments/assets/69cb3391-420a-463b-8040-0fa7d56acbc5" />

- Tareas
<img width="750" height="750" alt="image" src="https://github.com/user-attachments/assets/e1183a99-2a84-40dc-8fab-cc534d3629de" />

- Panel Usuario
<img width="750" height="750" alt="image" src="https://github.com/user-attachments/assets/74768861-8e78-4e0d-bd28-b146199d465e" />



