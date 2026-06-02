# AgroBarceló Web

Proyecto full-stack en JavaScript para AgroBarceló.

## Estructura

```text
AgroBarcelo-Web/
├── api/      # Backend Node.js + Express
└── client/   # Frontend React + Vite
```

## Requisitos

- Node.js 20 o superior recomendado.
- npm 10 o superior recomendado.

## Configuración inicial

Instalar dependencias desde la raíz del monorepo:

```bash
npm install
```

Crear los archivos de entorno a partir de los ejemplos:

```bash
cp api/.env.example api/.env
cp client/.env.example client/.env
```

## Ejecutar backend

```bash
npm run dev:api
```

La API queda disponible en `http://localhost:3000`.

Endpoints iniciales:

- `GET /api/health`
- `GET /api/products`

## Ejecutar frontend

En otra terminal:

```bash
npm run dev:client
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts útiles

- `npm run dev:api`: inicia el backend Express en modo desarrollo.
- `npm run dev:client`: inicia el frontend Vite en modo desarrollo.
- `npm run build`: genera el build de producción del frontend.
- `npm run start:api`: inicia el backend sin modo watch.

## Notas del alcance actual

- El proyecto usa únicamente JavaScript.
- No usa TypeScript.
- No usa Next.js.
- No incluye autenticación todavía.
- No conecta a SQL Server todavía.
