"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const RoomSchema = new mongoose_2.Schema({
    name: { type: String, required: true },
    isGroup: { type: Boolean, required: true },
}, { timestamps: true });
exports.Room = mongoose_1.default.model('Room', RoomSchema);
