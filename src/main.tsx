import { createRoot } from 'react-dom/client';
import './index.css';
import ReactQueryProvider from '@/components/ReactQueryProvider.tsx';
import App from '@/App';
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_SERVER || import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000';

export const clientSocket = io(socketUrl, {
  transports: ['websocket', 'polling'],
});

clientSocket.on('connect', () => {
  console.log('⚡ [Socket.IO] Connected to server, ID:', clientSocket.id);
});

clientSocket.on('disconnect', () => {
  console.log('❌ [Socket.IO] Disconnected from server');
});

createRoot(document.getElementById('root')!).render(
  <ReactQueryProvider>
    <App />
  </ReactQueryProvider>,
);
