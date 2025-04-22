"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const room_model_1 = __importStar(require("../models/room.model"));
const roomMember_model_1 = __importStar(require("../models/roomMember.model"));
// get All Rooms
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        // Get memberships that user joined
        const memberships = yield roomMember_model_1.RoomMember.find({ userId });
        // Get roomId
        const roomIds = memberships.map(m => m.roomId);
        // Get room info
        const rooms = yield room_model_1.Room.find({ _id: { $in: roomIds } });
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});
// get Private Rooms
const getPrivateRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        // Get memberships that user joined
        const memberships = yield roomMember_model_1.RoomMember.find({ userId });
        // Get roomId
        const roomIds = memberships.map(m => m.roomId);
        // Get room info
        const rooms = yield room_model_1.Room.find({ _id: { $in: roomIds }, isGroup: false });
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});
// get Group Rooms
const getGroupRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        // Get memberships that user joined
        const memberships = yield roomMember_model_1.RoomMember.find({ userId });
        // Get roomId
        const roomIds = memberships.map(m => m.roomId);
        // Get room info
        const rooms = yield room_model_1.Room.find({ _id: { $in: roomIds }, isGroup: true });
        res.status(200).json(rooms);
    }
    catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});
// createGroupRoom
const createGroupRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, users } = req.body;
    if (!name || !users || users.length === 0) {
        return res.status(400).json({ error: "Invalid input" });
    }
    try {
        const room = yield room_model_1.default.createGroupRoom(name);
        const member = yield roomMember_model_1.default.createMembers(room._id, users);
        res.status(201).json({ room, member });
    }
    catch (err) {
        console.error("Failed to create group room:", err);
        res.status(500).json({ error: "Failed to create group room" });
    }
});
exports.default = {
    getAllRooms,
    getPrivateRooms,
    getGroupRooms,
    createGroupRoom,
};
