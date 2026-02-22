import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const initWebSocket = () => {
  const socket = new SockJS('http://172.31.39.0:8080/ws'); // Replace with your backend URL
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log('WebSocket connected');
      stompClient.subscribe('/topic/alerts', (message) => {
        const alert = JSON.parse(message.body);
        // Handle alert (show banner, local notification)
        // You can use a global state or event emitter to show banner
      });
      stompClient.subscribe('/topic/incidents', (message) => {
        const incident = JSON.parse(message.body);
        // Update feed/map (you can use a global state or refresh)
      });
    },
  });
  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) stompClient.deactivate();
};