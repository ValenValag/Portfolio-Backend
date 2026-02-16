# Etapa 1: Build con Gradle + Java 21
FROM gradle:8.3-jdk-jammy AS builder
USER gradle
WORKDIR /home/gradle/src

COPY --chown=gradle:gradle build.gradle settings.gradle ./
RUN gradle --no-daemon build || true

COPY --chown=gradle:gradle src ./src
RUN gradle --no-daemon bootJar

# Etapa 2: Runtime con solo JDK 21
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copiar el jar desde la etapa builder
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
