# Step 1: Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /creatifpro
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Step 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /creatifpro
COPY --from=build /creatifpro/target/*.jar creatifpro.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "creatifpro.jar"]