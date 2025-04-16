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
const room_model_1 = require("../models/room.model");
const friend_model_1 = require("../models/friend.model");
const roomMember_model_1 = require("../models/roomMember.model");
const mongoose_1 = require("mongoose");
// get All Rooms
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield room_model_1.Room.find();
        res.status(200).json(rooms);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});
// get Private Rooms
const getPrivateRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privateRooms = yield room_model_1.Room.find({ isGroup: false });
        res.status(200).json(privateRooms);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch Private Rooms" });
    }
});
// get Group Rooms
const getGroupRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupRooms = yield room_model_1.Room.find({ isGroup: true });
        res.status(200).json(groupRooms);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to Group Rooms" });
    }
});
// create Room
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, isGroup } = req.body;
    if (typeof name !== 'string' || typeof isGroup !== 'boolean') {
        res.status(400).json({ error: "Invalid data format" });
        return;
    }
    // private room
    if (!isGroup) {
        const ids = name.split('_');
        if (ids.length !== 2 || !mongoose_1.Types.ObjectId.isValid(ids[0]) || !mongoose_1.Types.ObjectId.isValid(ids[1])) {
            res.status(400).json({ error: "Invalid private room name format" });
            return;
        }
        const [id1, id2] = ids.sort();
        try {
            // check is friend or not
            const isFriend = yield friend_model_1.Friend.findOne({ user1Id: id1, user2Id: id2 });
            if (!isFriend) {
                res.status(403).json({ error: "Users are not friends" });
                return;
            }
            // check private room is exis?
            const existing = yield room_model_1.Room.findOne({ name: `${id1}_${id2}`, isGroup: false });
            if (existing) {
                res.status(400).json({ error: "Private room already exists" });
                return;
            }
            const newRoom = new room_model_1.Room({ name: `${id1}_${id2}`, isGroup: false });
            const savedRoom = yield newRoom.save();
            yield roomMember_model_1.RoomMember.create([
                { roomId: savedRoom._id, usrId: id1 },
                { roomId: savedRoom._id, usrId: id2 },
            ]);
            res.status(201).json(savedRoom);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create private room" });
        }
    }
    // group room
    try {
        const existing = yield room_model_1.Room.findOne({ name, isGroup: true });
        if (existing) {
            res.status(400).json({ error: "Group room already exists" });
            return;
        }
        const newRoom = new room_model_1.Room({ name, isGroup: true });
        const saveRoom = yield newRoom.save();
        res.status(201).json(saveRoom);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create group room" });
    }
});
exports.default = {
    getAllRooms,
    getPrivateRooms,
    getGroupRooms,
    createRoom
};
