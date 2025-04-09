# YouAccess: Sistema de Control de Acceso Backend

![YouAccess Logo](https://youaccess.netlify.app/you-access-logo-01.svg)

## Descripción General

YouAccess es un sistema integral de control de acceso que gestiona la asistencia de empleados mediante tarjetas NFC. Este backend proporciona las APIs necesarias para la gestión de usuarios, organización de departamentos, seguimiento de asistencia y notificaciones en tiempo real.

## Características

- **Autenticación de Usuarios**
  - Registro e inicio de sesión
  - Control de acceso basado en roles (Administrador, Usuario)
  - Autenticación basada en JWT

- **Gestión de Tarjetas NFC**
  - Registro de tarjetas mediante dispositivo ESP32
  - Asignación de tarjetas a usuarios
  - Seguimiento del estado de tarjetas en tiempo real

- **Gestión de Departamentos**
  - Crear, actualizar y eliminar departamentos
  - Añadir y eliminar usuarios de departamentos
  - Seguimiento de asistencia por departamento

- **Registro de Asistencia**
  - Registros de entrada y salida
  - Filtrado de informes de asistencia por rango de fechas
  - Historial de asistencia por departamento y por usuario

- **Notificaciones en Tiempo Real**
  - Soporte WebSocket para actualizaciones instantáneas
  - Notificaciones por correo electrónico para eventos importantes
  - Alertas de escaneo de tarjetas

## Stack Tecnológico

- **Entorno de ejecución:** Node.js
- **Framework:** Express.js
- **Base de datos:** MongoDB
- **Autenticación:** JWT
- **Comunicación en tiempo real:** Socket.IO
- **Servicio de correo:** Nodemailer

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/BryanQuezada1910/access-control-backend.git
cd access-control-backend

```
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus valores de configuración.

## Variables de Entorno

El archivo `.env` debe contener las siguientes variables:

| Variable | Descripción |
|----------|-------------|
| `FRONTEND_URL` | URL del frontend para CORS |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `MONGO_URI` | URL completa de conexión a MongoDB |
| `MONGO_USER` | Usuario de MongoDB |
| `MONGO_PASSWORD` | Contraseña de MongoDB |
| `NODE_ENV` | Entorno de ejecución (development/production) |
| `SMTP_HOST` | Host del servidor SMTP para envío de correos |
| `SMTP_PORT` | Puerto del servidor SMTP |
| `SMTP_EMAIL` | Dirección de correo electrónico para envío |
| `SMTP_PASSWORD` | Contraseña del correo electrónico |


4. Iniciar el servidor:
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## Estructura del Proyecto

```
├── config/             # Configuraciones de la aplicación
├── controllers/        # Controladores
├── middleware/         # Middlewares personalizados
├── models/             # Modelos de datos
├── routes/             # Rutas de la API
├── services/           # Servicios de negocio
├── utils/              # Utilidades
├── websocket/          # Configuración de Socket.IO
├── app.js              # Punto de entrada de la aplicación
└── package.json        # Dependencias y scripts
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil de usuario

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Tarjetas NFC
- `POST /api/cards` - Registrar nueva tarjeta
- `GET /api/cards` - Obtener todas las tarjetas
- `PUT /api/cards/:id` - Asignar tarjeta a usuario
- `DELETE /api/cards/:id` - Eliminar tarjeta

### Departamentos
- `POST /api/departments` - Crear departamento
- `GET /api/departments` - Listar departamentos
- `PUT /api/departments/:id` - Actualizar departamento
- `DELETE /api/departments/:id` - Eliminar departamento

### Asistencia
- `POST /api/attendance/check` - Registrar entrada/salida
- `GET /api/attendance` - Obtener registros de asistencia
- `GET /api/attendance/reports` - Generar informes

## Eventos WebSocket

- `connection` - Nuevo usuario conectado
- `disconnect` - Usuario desconectado
- `assistance` - Evento de asistencia (entrada/salida)
- `unassignedCard` - Escaneo de tarjeta no asignada

## Author
Bryan Quezada