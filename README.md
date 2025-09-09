# 📅 App de Eventos

Una app sencilla para crear y gestionar eventos. Frontend en React, backend en Node.js.

## 📁 Estructura

```
proyecto/
├── backend/          # API del servidor
│   ├── src/
│   │   ├── controllers/  # Lógica de endpoints
│   │   ├── models/      # Modelos de MongoDB
│   │   ├── routes/      # Rutas del API
│   │   └── app.js       # Servidor principal
│   └── uploads/         # Imágenes subidas
├── frontend/         # App de React
│   ├── src/
│   │   ├── components/  # Componentes de UI
│   │   ├── pages/       # Páginas principales
│   │   └── App.jsx      # App principal
└── README.md
```

## 🔧 Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` con:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Eventos
JWT_SECRET=miclaveSecreta123
NODE_ENV=development
```

## 🚀 Como ejecutar

### Backend (Puerto 5000)

```bash
cd backend
npm install
npm start
```

### Frontend (Puerto 5173)

```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Base de Datos

Necesitas MongoDB ejecutándose. La app crea 2 colecciones:

- **usuarios** - Login, registro, perfil
- **eventos** - Crear eventos, asistir, editar, eliminar

## 📋 Datos de Prueba

Para cargar eventos de ejemplo:

```bash
cd backend
npm run seed
```

Usuarios de prueba (password: `123456`):

- naruto@konoha.com
- sasuke@konoha.com
- sakura@konoha.com

## 🔑 Funcionalidades

- ✅ Registro y login de usuarios
- ✅ Crear, editar y eliminar eventos
- ✅ Subir imágenes para eventos
- ✅ Confirmar asistencia a eventos
- ✅ Ver lista de eventos y detalles
