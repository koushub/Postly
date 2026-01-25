FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/Blog_Application_Spring-Boot-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
