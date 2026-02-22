import { Client } from '@stomp/stompjs';
import { DeviceEventEmitter } from 'react-native';
import SockJS from 'sockjs-client';

let stompClient = null;

// Fix #27: Point to your local backend
// For physical device: replace 'localhost' with your Mac's local IP
const WS_URL = 'http://172.31.34.123:8080/ws';

export const initWebSocket = () => {
  const socket = new SockJS(WS_URL);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket connected');

      // Fix #22 & #23: Emit events so HomeScreen, MapScreen, and App can react
      stompClient.subscribe('/topic/alerts', (message) => {
        const alert = JSON.parse(message.body);
        // Triggers AlertBanner in App.js
        DeviceEventEmitter.emit('NEW_ALERT', alert);
      });

      stompClient.subscribe('/topic/incidents', (message) => {
        const incident = JSON.parse(message.body);
        // Triggers refresh in HomeScreen and MapScreen
        DeviceEventEmitter.emit('NEW_INCIDENT', incident);
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    },
  });
  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) stompClient.deactivate();
};