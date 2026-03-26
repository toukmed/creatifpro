# =============================================
# Stage 1: Build
# =============================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copier d'abord les fichiers de configuration Maven pour le cache des dépendances
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Télécharger les dépendances (cette couche sera mise en cache si pom.xml ne change pas)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copier le code source
COPY src src

# Build de l'application
RUN ./mvnw clean package -DskipTests -B

# =============================================
# Stage 2: Runtime (image finale légère)
# =============================================
FROM eclipse-temurin:21-jre-alpine

# Labels OCI pour les métadonnées
LABEL org.opencontainers.image.title="CreatifPro Backend" \
      org.opencontainers.image.description="CREATIFPRO Management Application" \
      org.opencontainers.image.version="0.0.1" \
      org.opencontainers.image.vendor="CreatifPro"

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 creatifgroup && \
    adduser --system --uid 1001 --ingroup creatifgroup toukrichte

# Copier le JAR depuis le stage de build
COPY --from=build --chown=toukrichte:creatifgroup /app/target/*.jar app.jar

# Changer vers l'utilisateur non-root
USER toukrichte

# Exposer le port
EXPOSE 8080

# Health check pour le monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Variables d'environnement JVM optimisées pour les conteneurs
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Point d'entrée avec support des options JVM
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
