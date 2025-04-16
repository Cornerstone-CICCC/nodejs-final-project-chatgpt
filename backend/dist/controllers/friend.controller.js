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
const friend_model_1 = require("../models/friend.model");
const user_model_1 = __importDefault(require("../models/user.model"));
// Get friends by userId
const getFriendByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const friendships = yield friend_model_1.Friend.find({
            $or: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        }).populate('user1Id user2Id');
        const friends = friendships.map(f => {
            const isUser1 = f.user1Id._id.toString() === userId;
            return isUser1 ? f.user2Id : f.user1Id;
        });
        res.status(200).json(friends);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch friends" });
    }
});
// Add friend
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, friendEmail } = req.body;
    if (!userId || !friendEmail) {
        res.status(400).json({ error: "Missing required fields to add friend" });
        return;
    }
    try {
        const friendUser = yield user_model_1.default.getUserByEmail(friendEmail);
        if (!friendUser) {
            return res.status(404).json({ error: "Friend email not found" });
        }
        const friendUserId = friendUser._id;
        // sort
        const [user1Id, user2Id] = userId.toString() < friendUserId.toString()
            ? [userId, friendUserId]
            : [friendUserId, userId];
        // Duplicate check
        const existing = yield friend_model_1.Friend.findOne({ user1Id, user2Id });
        if (existing) {
            return res.status(409).json({ error: 'Already friends' });
        }
        // create friendship
        const friend = new friend_model_1.Friend({ user1Id, user2Id });
        yield friend.save();
        // create chat room for private
        // await roomModel.createPrivateRoom([user1Id, user2Id])
        res.status(201).json(friend);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add friend' });
    }
});
// Delete friend
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) {
        return res.status(400).json({ error: "Missing required fields to delete friend" });
    }
    try {
        // sort
        const [user1Id, user2Id] = userId.toString() < friendId.toString()
            ? [userId, friendId]
            : [friendId, userId];
        const deleted = yield friend_model_1.Friend.findOneAndDelete({ user1Id, user2Id });
        if (!deleted) {
            return res.status(404).json({ error: "Friendship not found" });
        }
        res.status(200).json({ message: "Friendship deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete friend" });
    }
});
exports.default = {
    getFriendByUserId,
    addFriend,
    deleteFriend,
};
