# Imagen base Java
FROM eclipse-temurin:21-jdk

# Carpeta interna
WORKDIR /app

# Copiamos proyecto
COPY src/main/java/com/valenvalag/portfoliobackend .

# Construimos jar
RUN ./mvnw clean package -DskipTests

# Railway usa puerto dinámico
ENV PORT=8080

# Ejecutamos app
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar target/*.jar"]
