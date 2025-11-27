# EventHub - Sistema de Gestión de Eventos con React Router

Un sistema moderno y completo de gestión de eventos y reservas construido con React Router v6+, Tailwind CSS y localStorage para la persistencia de datos.

## Características

- **Descubrimiento de Eventos**: Explora y filtra eventos por categoría, busca por título o descripción
- **Autenticación de Usuarios**: Registro, inicio de sesión y gestión de cuentas
- **Reservas**: Reserva entradas para eventos con seguimiento de disponibilidad en tiempo real
- **Panel de Usuario**: Ve tus reservas, información de cuenta y gestiona tus reservas
- **Panel de Administrador**: 
  - Resumen con métricas clave (ingresos, total de reservas, asistentes)
  - Gestión de eventos con seguimiento de capacidad
  - Monitoreo de reservas
  - Historial de correos electrónicos y registro de comunicaciones
- **Simulación de Correo Electrónico**: El sistema genera correos de confirmación, cancelación y recordatorios
- **Notificaciones**: Notificaciones toast en la aplicación para todas las acciones
- **Diseño Responsivo**: Funciona perfectamente en escritorio, tablet y dispositivos móviles

## Stack Tecnológico

- **Frontend**: React 19 con TypeScript
- **Enrutamiento**: React Router v7
- **Estilos**: Tailwind CSS v4 con tema personalizado
- **Datos**: localStorage para persistencia
- **Construcción**: Vite

## Comenzando

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Construye para producción:
   ```bash
   npm run build
   ```

## Estructura del Proyecto

```
src/
├── pages/              # Componentes de página (rutas)
│   ├── home.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── event-detail.tsx
│   ├── reservations.tsx
│   ├── admin.tsx
│   ├── admin-emails.tsx
│   ├── confirmation.tsx
│   └── not-found.tsx
├── components/         # Componentes reutilizables
│   ├── navigation.tsx
│   ├── protected-route.tsx
│   ├── booking-form.tsx
│   ├── reservation-confirmation.tsx
│   ├── email-history.tsx
│   ├── notifications-center.tsx
│   └── admin-setup.tsx
├── contexts/          # Contextos de React para estado
│   ├── auth-context.tsx
│   ├── data-context.tsx
│   └── notifications-context.tsx
├── services/          # Servicios de lógica de negocio
│   └── email-service.ts
├── App.tsx            # Componente principal de la app con enrutamiento
├── index.tsx          # Punto de entrada
└── globals.css        # Estilos globales y tema
```

## Rutas Clave

- `/` - Página de inicio con descubrimiento de eventos
- `/login` - Inicio de sesión de usuario
- `/signup` - Registro de usuario
- `/events/:id` - Detalles del evento y reserva
- `/reservations` - Reservas del usuario (protegido)
- `/confirmation` - Confirmación de reserva (protegido)
- `/admin` - Panel de administrador (solo admin)
- `/admin/emails` - Historial de correos (solo admin)

## Cuenta de Demostración

- Correo: `admin@example.com`
- Contraseña: `admin123`

La cuenta de demostración tiene privilegios de administrador. También puedes crear tu propia cuenta de usuario a través de la página de registro.

## Características Explicadas

### Autenticación
- Los nuevos usuarios pueden registrarse con correo, nombre y contraseña
- Los usuarios existentes pueden iniciar sesión
- El primer usuario obtiene automáticamente el rol de administrador
- Las credenciales se almacenan en localStorage

### Gestión de Eventos
- Los eventos se muestran con porcentaje de disponibilidad
- Actualizaciones de conteo de entradas en tiempo real
- Filtrado por precio y categoría
- Funcionalidad de búsqueda

### Sistema de Reservas
- Los usuarios pueden reservar de 1 a 10 entradas por evento
- Generación automática de confirmación por correo electrónico
- Gestión de capacidad con prevención de sobrecupo
- Cancelación con seguimiento de reembolsos

### Características de Administrador
- Panel de resumen con métricas clave
- Seguimiento de ocupación de eventos
- Monitoreo de reservas
- Visor de historial de correos con filtrado por tipo

### Sistema de Correo Electrónico
- Correos de confirmación automáticos al reservar
- Correos de cancelación con montos de reembolso
- Correos recordatorios para próximos eventos
- Historial de correos almacenado y visible en el panel de administración

## Personalización

### Colores del Tema
Edita `src/globals.css` para personalizar la paleta de colores:
- Primario (Azul): Azul profesional para acciones principales
- Secundario (Gris): Gris suave para fondos
- Acento (Verde): Verde vibrante para destacados

### Añadir Más Eventos
Edita el array `INITIAL_EVENTS` en `src/contexts/data-context.tsx` para añadir más eventos de demostración.

## Soporte de Navegador

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Licencia

MIT

## Configuración del Backend

El proyecto ahora incluye un backend Django para servir la API.

### Prerrequisitos

- Python 3.8+
- pip

### Instalación y Ejecución

1. Navega al directorio `Backend`:
   ```bash
   cd ../Backend
   ```

2. Instala las dependencias:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. Ejecuta las migraciones:
   ```bash
   python manage.py migrate
   ```

4. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```

La API estará disponible en `http://localhost:8000/api/`.

### Endpoints de la API

- **Usuarios**: `/api/users/`
- **Eventos**: `/api/events/`
- **Reservas**: `/api/reservations/`

### Credenciales de Administrador

Para acceder al panel de administración de Django en `http://localhost:8000/admin/`, usa las siguientes credenciales:

- **Correo/Usuario**: `admin@example.com` / `admin`
- **Contraseña**: `admin123`
