"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMember = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const RoomMemberSchema = new mongoose_2.Schema({
    roomId: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Room', required: true },
    usrId: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String },
}, { timestamps: true });
exports.RoomMember = mongoose_1.default.model('RoomMember', RoomMemberSchema);
