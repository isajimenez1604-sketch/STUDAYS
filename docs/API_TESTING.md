# Probar la API con Thunder Client o Postman

La API usa el prefijo `/api/v1` y ofrece estos cinco endpoints `POST`:

| Método | URL | Uso |
| --- | --- | --- |
| POST | `http://localhost:3000/api/v1/users/register` | Registrar usuario |
| POST | `http://localhost:3000/api/v1/auth/login` | Iniciar sesión |
| POST | `http://localhost:3000/api/v1/tasks` | Crear tarea |
| POST | `http://localhost:3000/api/v1/chats` | Crear chat |
| POST | `http://localhost:3000/api/v1/chats/join` | Unirse a un chat |

## Organización de la API

La API separa el trabajo en capas sencillas:

- `routes/v1`: conecta cada URL con su controlador.
- `controllers`: recibe la petición, valida el body con un DTO y prepara la respuesta.
- `dto`: comprueba y normaliza los datos recibidos.
- `services`: aplica las reglas de registro, login y creación de tareas.
- `repositories`: consulta y guarda datos en Supabase.
- `data/models`: describe los datos de usuarios y tareas.
- `data/models/chat.model.ts`: describe chats y participantes.
- `middlewares` y `exceptions`: centralizan las respuestas de error.
- `config/container.ts`: registra e inyecta controladores, servicios y repositorios.

Flujo habitual: **ruta → controlador → DTO → servicio → repositorio → Supabase**. Así, la lógica de negocio no necesita conocer directamente las consultas de base de datos.

## Preparar la base de datos

1. Configura `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env`.
2. En Supabase > SQL Editor, ejecuta solo el script que corresponda:
   - Base nueva: `src/data/schema.sql`.
   - Usuarios existentes con `users.id` tipo UUID: `src/data/migrations/001_users_autoincrement_id.sql`.
   - Usuarios ya migrados a números, pero con IDs grandes: detén el backend y ejecuta `src/data/migrations/002_reset_user_ids_from_one.sql`. Renumera desde 1 y conserva las relaciones de tareas.
   - Base existente con usuarios y tareas, a la que faltan las tablas de chat: `src/data/migrations/003_create_chats.sql`.
   Las migraciones `001` y `002` crean `public.tasks` si todavía no existe.
3. Inicia el backend con `npm run api`.
4. En Thunder Client o Postman, crea cada solicitud con el método y URL indicados, el encabezado `Content-Type: application/json` y el body en modo JSON.

## 1. Registrar usuario

**POST** `http://localhost:3000/api/v1/users/register`

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "password": "clave1234"
}
```

Respuesta esperada: **201 Created**. Guarda el `user.id` de la respuesta para crear una tarea.

## 2. Iniciar sesión

**POST** `http://localhost:3000/api/v1/auth/login`

```json
{
  "email": "ana@example.com",
  "password": "clave1234"
}
```

Respuesta esperada: **200 OK**, con los datos públicos del usuario. Este login solo comprueba las credenciales; por ahora no crea ni almacena una sesión o token.

## 3. Crear tarea

**POST** `http://localhost:3000/api/v1/tasks`

Copia el `id` numérico del usuario de la respuesta de registro o login y úsalo como `userId`:

```json
{
  "userId": 1,
  "title": "Estudiar para Cálculo II",
  "description": "Repasar los ejercicios de integrales",
  "dueDate": "2026-10-12T15:00:00-05:00"
}
```

`description` y `dueDate` son opcionales; si omites `dueDate`, la tarea no tendrá fecha límite. Respuesta esperada: **201 Created**, con la tarea guardada y su estado inicial `pending`.

## 4. Crear chat

**POST** `http://localhost:3000/api/v1/chats`

```json
{
  "userId": 1,
  "name": "Grupo de Cálculo II"
}
```

Usa el ID de un usuario existente. Respuesta esperada: **201 Created**. Guarda el `chat.id` para usarlo en la solicitud de unión. El usuario indicado queda como creador del chat.

## 5. Unirse a un chat

**POST** `http://localhost:3000/api/v1/chats/join`

```json
{
  "chatId": 1,
  "userId": 2
}
```

Registra un segundo usuario y usa su ID junto con el ID de chat devuelto al crearlo. Respuesta esperada: **201 Created**. Un usuario que ya es creador o miembro recibe un error tipificado de conflicto.

El catálogo central de errores tipificados está en `src/exceptions/errors/app.error.ts`, y el middleware de `src/middlewares/error.middleware.ts` los convierte en respuestas HTTP.

> En esta versión de aprendizaje, el login no entrega tokens y crear tareas no requiere autenticación: el cliente envía `userId` en el body. No es seguro para producción porque cualquiera podría intentar crear tareas para otro usuario.

## 6. Crear publicación del foro

**POST** `http://localhost:3000/api/v1/forum/posts`

Crea una publicación para el foro. El usuario indicado debe existir en la base de datos.

Encabezado:

`Content-Type: application/json`

Body en formato JSON:

```json
{
  "userId": 1,
  "title": "Consejos para estudiar",
  "content": "¿Qué técnicas de estudio recomiendan para los exámenes?"
}
```

Respuesta esperada: **201 Created**, con un mensaje de confirmación y los datos de la publicación creada.

Validaciones:
- `userId` debe ser un entero positivo correspondiente a un usuario existente.
- `title` es obligatorio y admite hasta 150 caracteres.
- `content` es obligatorio y admite hasta 5000 caracteres.

## 7. Agregar un comentario al foro

**POST** `http://localhost:3000/api/v1/forum/posts/1/comments`

Agrega un comentario a una publicación existente. Sustituye `1` por el ID real de la publicación.

Encabezado:

`Content-Type: application/json`

Body en formato JSON:

```json
{
  "userId": 2,
  "content": "Recomiendo estudiar con ejercicios prácticos."
}
```

Respuesta esperada: **201 Created**, con un mensaje de confirmación y los datos del comentario creado.

Validaciones:
- `userId` debe corresponder a un usuario existente.
- La publicación indicada debe existir.
- `content` es obligatorio y admite hasta 2000 caracteres.

Si la publicación o el usuario no existen, la API debe devolver un error apropiado.
