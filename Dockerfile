# ==============================================================================
# 🐳 Dockerfile - Frontend (tp-maniqui-frontend)
# Descripción: Compila la aplicacion React/Vite y la sirve usando Nginx.
# ==============================================================================

# --- Stage 1: Construcción ---
FROM node:22-slim AS builder

# Habilitar corepack e instalar la version adecuada de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar configuraciones y dependencias necesarias para compilar
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html .env* ./
COPY src ./src
COPY public ./public

# Instalar dependencias compilando a produccion
RUN pnpm install --frozen-lockfile
RUN pnpm build

# --- Stage 2: Servidor Web ---
FROM nginx:alpine

# Establecer meta-informacion legible en el contenedor
LABEL project="tecda-maniqui"
LABEL component="frontend"
LABEL description="Frontend de React compilado y servido a traves de Nginx con soporte para React Router."

# Copiar el build estatico generado al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuracion personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
