"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friend = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const FriendSchema = new mongoose_2.Schema({
    user1Id: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true },
    user2Id: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
FriendSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });
exports.Friend = mongoose_1.default.model('Friend', FriendSchema);
