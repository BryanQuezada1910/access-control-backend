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
git clone https://github.com/tuusuario/access-control-backend.git
cd access-control-backend