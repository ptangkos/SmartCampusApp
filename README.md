# Smart-Campus-Emergency-Response-System-




## Inspiration

We wanted to improve campus safety by making emergency reporting fast, accessible, and secure. Many students hesitate to report incidents due to fear or lack of anonymity. Our goal was to build a real-time system that encourages responsible reporting while protecting users.

## What it does

Smart Campus is a mobile emergency response app where students can report incidents anonymously or with their ID, capture live photos (camera-only), and automatically share their location. 

Critical events like ICE, Shooting, and Fire trigger instant push notifications and real-time alerts. The app also includes a live map, urgency-based news feed, and a mental health support corner with one-tap emergency calling.

## How we built it

Backend: Spring Boot, PostgreSQL, JWT authentication, WebSockets, Expo Push API  
Frontend: React Native (Expo), React Navigation, Maps, Axios, STOMP WebSocket  

We built it as a full-stack system with real-time communication and role-based access control.

## Challenges we ran into

- Implementing reliable WebSocket real-time updates  
- Managing secure push notifications  
- Enforcing live camera-only image capture  
- Protecting reporter identity while allowing authority access  

## Accomplishments that we're proud of

- Built a real-time full-stack emergency platform  
- Integrated WebSockets and push notifications  
- Delivered cross-platform support (iOS & Android)  
- Designed scalable backend architecture  

## What we learned

- API-first design improves team efficiency  
- Real-time systems enhance user responsiveness  
- Security and privacy must be designed from the beginning  

## What's next for Smart Campus Emergency Response App

- AI-based severity prediction  
- Predictive risk heatmaps  
- Admin analytics dashboard  
- University SSO integration  
- Multi-campus deployment




<img width="300" alt="IMG_91cb25e5" src="https://github.com/user-attachments/assets/91cb25e5-7200-4138-a434-826819f24a8c" />

<img width="300" alt="IMG_8698" src="https://github.com/user-attachments/assets/c4b98aa6-17fd-4e98-88c9-84d2283ffd66" />

<img width="300" alt="IMG_8699" src="https://github.com/user-attachments/assets/a54db314-8a1b-4165-ad4f-b273234fa712" />

<img width="300" alt="IMG_8699" src="https://github.com/user-attachments/assets/a833e836-fba0-44ef-8c99-dc0e4feb82d2" />

<img width="300" alt="IMG_8700" src="https://github.com/user-attachments/assets/25b45f82-b0c8-4788-a3d3-eaf5e2fcafcd" />





  
## Backend Setup:

<p align="center">
  <img width="300" alt="IMG_91cb25e5" src="https://github.com/user-attachments/assets/91cb25e5-7200-4138-a434-826819f24a8c" />
  <img width="300" alt="IMG_8698" src="https://github.com/user-attachments/assets/c4b98aa6-17fd-4e98-88c9-84d2283ffd66" />
</p>

<p align="center">
  <img width="300" alt="IMG_8699a" src="https://github.com/user-attachments/assets/a54db314-8a1b-4165-ad4f-b273234fa712" />
  <img width="300" alt="IMG_8699b" src="https://github.com/user-attachments/assets/a833e836-fba0-44ef-8c99-dc0e4feb82d2" />
</p>

<p align="center">
  <img width="300" alt="IMG_8700" src="https://github.com/user-attachments/assets/25b45f82-b0c8-4788-a3d3-eaf5e2fcafcd" />
</p>

need Java 11, Maven, and PostgreSQL.
run below code to check
```

java -version
mvn -v
psql --version
node -v
expo --version
```
![79a39a38-fa1a-4e18-a533-a099d54c5358](https://github.com/user-attachments/assets/91cb25e5-7200-4138-a434-826819f24a8c)

Create a database named campus_emergency.

Update application.properties with your database credentials.

Open the file src/main/resources/application.properties and update the spring.datasource.username and spring.datasource.password with your PostgreSQL credentials.

Run mvn spring-boot:run from the backend folder.

Frontend Setup:

Install Node.js and Expo CLI.

Run npm install in the frontend folder.

Update API_URL in frontend/src/services/api.js and WebSocket URL in frontend/src/services/websocket.js to point to your backend (e.g., http://localhost:8080 or your deployed URL).

Run expo start and use Expo Go on your device or emulator.
