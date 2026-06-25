# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
# Copy pom.xml first
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
# Copy backend source code
COPY backend/ ./
# Copy built frontend assets into Spring Boot static resources folder
COPY --from=frontend-builder /app/frontend/dist /app/backend/src/main/resources/static
# Build the JAR
RUN mvn package -DskipTests

# Stage 3: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/shopsphere-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
