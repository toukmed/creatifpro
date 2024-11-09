# Start with a base image with Java 19
FROM eclipse-temurin:19-jdk-jammy

# Create a directory for the app
WORKDIR /app

# Copy built Spring Boot jar into container
COPY target/creatifpro-0.0.1-SNAPSHOT.jar /app/creatifpro-0.0.1-SNAPSHOT.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/creatifpro-0.0.1-SNAPSHOT.jar"]

