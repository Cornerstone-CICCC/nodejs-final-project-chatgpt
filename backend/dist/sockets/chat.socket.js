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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = __importDefault(require("../models/chat.model"));
const setupChatSocket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, senderId, message } = data;
            try {
                // Save message to MongoDB
                const chat = yield chat_model_1.default.createChat(roomId, senderId, message);
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
