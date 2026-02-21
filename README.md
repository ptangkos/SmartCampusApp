# Smart-Campus-Emergency-Response-System-



Backend Setup:

need Java 11, Maven, and PostgreSQL.
run 
```

java -version
mvn -v
psql --version
node -v
expo --version
```
to check

Create a database named campus_emergency.

Update application.properties with your database credentials.

Run mvn spring-boot:run from the backend folder.

Frontend Setup:

Install Node.js and Expo CLI.

Run npm install in the frontend folder.

Update API_URL in frontend/src/services/api.js and WebSocket URL in frontend/src/services/websocket.js to point to your backend (e.g., http://localhost:8080 or your deployed URL).

Run expo start and use Expo Go on your device or emulator.
