# Etapa 1: Build con Gradle y Java 21
FROM gradle:8.3-jdk21 AS build
WORKDIR /app

# Copiamos solo los archivos de Gradle para cachear dependencias
COPY build.gradle settings.gradle gradle.properties ./
RUN gradle --no-daemon build || true

# Copiamos el código fuente
COPY src ./src

# Build final del jar
RUN gradle --no-daemon bootJar

# Etapa 2: Imagen ligera con solo Java 21
WORKDIR /app

# Copiamos el jar generado
COPY --from=build /app/build/libs/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando para ejecutar la app
CMD ["java", "-jar", "app.jar"]
