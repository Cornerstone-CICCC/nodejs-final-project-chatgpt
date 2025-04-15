"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, senderId, message } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ roomId, senderId, message });
                yield chat.save();
                console.log(`${message} from ${senderId} saved to ${roomId}`);
                console.log("newMessage", roomId, chat);
                // For room-based broadcast
                io.to(roomId).emit('newMessage', chat);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('joinRoom', (data) => {
            socket.join(data.roomId);
            console.log(`${data.username} has joined the ${data.roomId}`);
        });
        socket.on('leaveRoom', (data) => {
            socket.leave(data.roomId);
            console.log(`${data.username} left ${data.roomId}`);
        });
        // On disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    }));
};
exports.default = setupChatSocket;
