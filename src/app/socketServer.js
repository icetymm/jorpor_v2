// File: api/socket.js
import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export { io };
