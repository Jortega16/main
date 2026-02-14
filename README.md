# J4Soluciones

Proyecto web corporativo para J4Soluciones, desarrollado con un Frontend en **Angular** y un Backend en **Node.js/Express**.

## Estructura

- `/frontend`: Aplicación Angular (Landing Page).
- `/backend`: API REST para manejo de formulario de contacto y envío de emails.

## Requisitos Previos

- Node.js (v16 o superior)
- Angular CLI (global): `npm install -g @angular/cli`

## Instrucciones de Ejecución

### 1. Backend

Configura y ejecuta el servidor API.

```bash
cd backend
npm install
# Copia el archivo de ejemplo de variables de entorno
copy .env.example .env
# IMPORTANTE: Edita .env con tus credenciales SMTP reales para que funcionen los correos
```

Para correr en desarrollo (con nodemon):
```bash
npm run dev
```
El servidor correrá en `http://localhost:3000`.

**Documentación API (Swagger):**
Disponible en `http://localhost:3000/api-docs`.

### 2. Frontend

Ejecuta la interfaz de usuario.

```bash
cd frontend
npm install
ng serve
```
Abre tu navegador en `http://localhost:4200`.

## Funcionalidades

- **Routing Angular**: Navegación SPA entre Inicio, Sobre Nosotros, Servicios y Contacto.
- **Formulario Reactivo**: Validaciones robustas en el frontend.
- **Envío de Emails**: Integración con Nodemailer en el backend.
- **Diseño Responsive**: Adaptable a móviles y escritorio con estilo corporativo.

## Configuración de Correo (.env)

Asegúrate de configurar correctamente el transporte SMTP en `backend/.env`:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com (o tu proveedor)
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_password_de_aplicacion
MAIL_FROM="J4Soluciones <no-reply@j4soluciones.com>"
MAIL_TO=contacto@j4soluciones.com
```
