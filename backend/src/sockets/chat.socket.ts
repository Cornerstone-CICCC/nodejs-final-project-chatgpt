import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { roomId, senderId, message } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ roomId, senderId, message });
        await chat.save();
        console.log(`${message} from ${senderId} saved to ${roomId}`)

        console.log("newMessage", roomId, chat)
        // For room-based broadcast
        io.to(roomId).emit('newMessage', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });
  
    socket.on('joinRoom', (data) => {
      socket.join(data.roomId)
      console.log(`${data.username} has joined the ${data.roomId}`)
    })
  
    socket.on('leaveRoom', (data) => {
      socket.leave(data.roomId)
      console.log(`${data.username} left ${data.roomId}`)
    })

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;