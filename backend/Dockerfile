# syntax=docker/dockerfile:1.7
# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace
COPY . .
RUN ./gradlew bootJar --no-daemon

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /workspace/build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app/app.jar"]

EXPOSE 8080 