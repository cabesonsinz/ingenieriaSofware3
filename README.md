# EventHub - Sistema de Gestión de Eventos

Este repositorio contiene el código fuente para EventHub, una aplicación completa para la gestión y reserva de eventos. El proyecto está dividido en dos partes principales: un Backend basado en Django y un Frontend desarrollado con React.

## Estructura del Proyecto

- **Backend/**: API RESTful construida con Django y Django Rest Framework. Maneja la lógica de negocio, base de datos, autenticación y gestión de datos.
- **FrontEnd/**: Aplicación de usuario construida con React, TypeScript y Tailwind CSS. Proporciona la interfaz para explorar eventos, realizar reservas y gestionar cuentas.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- **Node.js** (v18 o superior) y npm
- **Python** (v3.8 o superior) y pip
- **Git**

## Configuración e Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 1. Configuración del Backend (Django)

El backend debe estar ejecutándose para que el frontend funcione correctamente.

1.  Navega a la carpeta del Backend:
    ```bash
    cd Backend
    ```

2.  Instala las dependencias de Python:
    ```bash
    pip install django djangorestframework django-cors-headers
    ```

3.  Ejecuta las migraciones de la base de datos:
    ```bash
    python manage.py migrate
    ```

4.  Carga los datos iniciales (Eventos y Usuario Administrador):
    ```bash
    python manage.py seed_data
    ```

5.  Inicia el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```

    El backend estará disponible en `http://localhost:8000/`.
    - API: `http://localhost:8000/api/`
    - Panel de Administración: `http://localhost:8000/admin/`

    **Credenciales de Administrador:**
    - Usuario: `admin@example.com` (o `admin`)
    - Contraseña: `admin123`

### 2. Configuración del Frontend (React)

1.  Abre una nueva terminal y navega a la carpeta del Frontend:
    ```bash
    cd FrontEnd
    ```

2.  Instala las dependencias de Node:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo del frontend:
    ```bash
    npm run dev
    ```

    La aplicación se abrirá en tu navegador, generalmente en `http://localhost:5173/` (o el puerto que indique la terminal).

## Características Principales

- **Exploración de Eventos**: Visualiza eventos disponibles, filtra por categorías y busca por nombre.
- **Reservas en Tiempo Real**: Reserva entradas y ve la disponibilidad actualizada al instante.
- **Gestión de Usuarios**: Registro e inicio de sesión seguro.
- **Panel de "Mis Reservas"**: Los usuarios pueden ver y cancelar sus reservas.
- **Panel de Administración**: Acceso exclusivo para administradores para gestionar eventos, ver métricas y controlar reservas.

## Tecnologías Utilizadas

### Backend
- Django
- Django Rest Framework
- SQLite (Base de datos por defecto)

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- React Router
- Vite

## Solución de Problemas Comunes

- **Error de conexión**: Asegúrate de que el servidor Backend (`python manage.py runserver`) esté ejecutándose en el puerto 8000 mientras usas el Frontend.
- **Datos no cargan**: Verifica la consola del navegador y la terminal del backend para ver si hay errores de red.
- **Problemas al reservar**: Asegúrate de haber iniciado sesión. Si eres el administrador y no ves tus reservas, recuerda que las reservas canceladas no aparecen en la lista de "confirmadas".
