"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ChatSchema = new mongoose_2.Schema({
    //   roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    //   senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);
