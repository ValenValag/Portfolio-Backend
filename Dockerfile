# Etapa 1: Build
FROM gradle:8.3-jdk-jammy AS builder
WORKDIR /app

# Copiamos solo archivos de Gradle para cachear dependencias
COPY build.gradle settings.gradle gradle.properties ./
RUN gradle --no-daemon build || true

# Copiamos el código fuente
COPY src ./src

# Build final del jar
RUN gradle --no-daemon bootJar

# Etapa 2: Runtime
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
