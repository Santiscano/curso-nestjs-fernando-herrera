# Install dependencies only when needed

# Establece la imagen base para la etapa de "deps" (dependencias). Utiliza la imagen oficial de Node.js versión 18 basada en Alpine Linux 3.15.
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#  Instala las dependencias necesarias para el funcionamiento de algunas aplicaciones en Alpine Linux.
RUN apk add --no-cache libc6-compat
#  Establece el directorio de trabajo dentro del contenedor como /app.
WORKDIR /app
# Copia los archivos package.json y yarn.lock del directorio local al directorio /app del contenedor.
COPY package.json yarn.lock ./
#  Ejecuta el comando yarn install para instalar las dependencias de la aplicación. El flag --frozen-lockfile garantiza que las versiones de las dependencias se mantengan fijas según lo especificado en el archivo yarn.lock.
RUN yarn install --frozen-lockfile



# Build the app with cache dependencies
# Establece la imagen base para la etapa de "builder".
FROM node:18-alpine3.15 AS builder
#  Establece el directorio de trabajo dentro del contenedor como /app.
WORKDIR /app
# Copia el directorio node_modules de la etapa de "deps" al directorio /app/node_modules en la etapa de "builder", lo que aprovecha el caché de capas de Docker para evitar reinstalar las dependencias.
COPY --from=deps /app/node_modules ./node_modules
# Copia todos los archivos del directorio local al directorio /app del contenedor.
COPY . .
#  Ejecuta el comando yarn build para construir la aplicación.
RUN yarn build




# Production image, copy all the files and run next
# Establece la imagen base para la etapa de "runner".
FROM node:18-alpine3.15 AS runner
# Set working directory
# Establece el directorio de trabajo dentro del contenedor como /usr/src/app.
WORKDIR /usr/src/app
# Copia los archivos package.json y yarn.lock del directorio local al directorio /usr/src/app del contenedor.
COPY package.json yarn.lock ./
# Ejecuta el comando yarn install --prod para instalar solo las dependencias de producción (las que están marcadas en dependencies en package.json).
RUN yarn install --prod
# Copia el directorio dist (resultado de la compilación) de la etapa de "builder" al directorio /dist en la etapa de "runner".
COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

#  Establece el comando predeterminado para ejecutar la aplicación cuando se inicie el contenedor. En este caso, ejecutará node dist/main.
CMD [ "node","dist/main" ]