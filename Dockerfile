# ---------------------------
# Stage 1: Build
# ---------------------------
FROM gradle:9.3-jdk21 AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos necesarios para Gradle (optimiza cache)
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle
COPY src ./src

# Build con Gradle (producción, sin tests)
RUN gradle clean bootJar -x test -x check --no-daemon

# ---------------------------
# Stage 2: Runtime
# ---------------------------
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copiamos solo el jar generado en el stage anterior
COPY --from=build /app/build/libs/*.jar app.jar

# Exponemos el puerto que Railway asignará dinámicamente
EXPOSE 8080

# Ejecutamos la app con el puerto dinámico de Railway
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
