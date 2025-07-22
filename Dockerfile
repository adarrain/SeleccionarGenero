# Dockerfile para una aplicación Next.js

# Etapa 1: Instalar dependencias
# Usamos una imagen ligera de Node.js
FROM node:20-slim AS deps
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json ./
# Usamos 'npm ci' para instalaciones más rápidas y consistentes en CI/CD
RUN npm ci

# Etapa 2: Compilar la aplicación
# Usamos la misma imagen de Node.js
FROM node:20-slim AS builder
WORKDIR /app

# Copiar dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 3: Ejecutar la aplicación
# Usamos una imagen aún más pequeña para producción
FROM node:20-slim AS runner
WORKDIR /app

# Establecer el entorno de producción
ENV NODE_ENV=production

# Crear un usuario no privilegiado para ejecutar la aplicación
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copiar los artefactos de la compilación
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
