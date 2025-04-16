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
// CreateRoom
// createPrivateRoom
const createPrivateRoom = (users) => __awaiter(void 0, void 0, void 0, function* () {
    if (users.length !== 2) {
        console.log("Private room must have exactly 2 users");
        return;
    }
    const [id1, id2] = users[0]._id < users[1], _id, [users, []];
    0;
    _id, users[1]._id;
    users[1];
    _id ? [users[1]._id, users[0]._id] : ;
    if (!mongoose_1.Types.ObjectId.isValid(id1) || !mongoose_1.Types.ObjectId.isValid(id2)) {
        console.log("Invalid user IDs");
        return;
    }
    // check friends or not
    const areFriends = yield friend_model_1.Friend.findOne({
        $or: [
            { user1Id: id1, user2Id: id2 },
            { user1Id: id2, user2Id: id1 }
        ]
    });
    if (!areFriends) {
        console.log("Users are not friends");
        return;
    }
    const name = `${id1}_${id2}`;
    yield createRoom(res, name, false, [id1, id2]);
});
// createGroupRoom
const createGroupRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, users } = req.body;
    if (typeof name !== 'string' || !Array.isArray(users) || users.length < 2) {
        res.status(400).json({ error: "Invalid group room data" });
        return;
    }
    yield createRoom(res, name, true, users);
    res.status(200).json();
});
// createRoom
const createRoom = (name, isGroup, users) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield room_model_1.Room.findOne({ name, isGroup });
        if (existing) {
            console.log("Room already exists");
            return;
        }
        const newRoom = new room_model_1.Room({ name, isGroup });
        const savedRoom = yield newRoom.save();
        // RoomMember
        const members = users.map((userId) => ({
            roomId: savedRoom._id,
            usrId: userId,
            role: isGroup ? "member" : "participant"
        }));
        yield roomMember_model_1.RoomMember.insertMany(members);
        res.status(201).json(savedRoom);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create room" });
    }
});
exports.default = {
    getAllRooms,
    getPrivateRooms,
    getGroupRooms,
    createPrivateRoom,
    createGroupRoom
};
