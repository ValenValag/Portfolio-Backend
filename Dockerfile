# Etapa 1: Build con Gradle + Java 21
FROM gradle:8.3-jdk-jammy AS builder
WORKDIR /app

# Copiar solo archivos de Gradle para cachear dependencias
COPY build.gradle settings.gradle gradle.properties ./
RUN gradle --no-daemon build || true

# Copiar el código fuente
COPY src ./src

# Construir el jar final
RUN gradle --no-daemon bootJar

# Etapa 2: Runtime con solo JDK 21
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copiar el jar desde la etapa builder
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
