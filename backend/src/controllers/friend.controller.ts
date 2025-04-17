import { Request, Response } from "express";
import { Friend } from "../models/friend.model";
import userModel from "../models/user.model"
import roomModel, { Room } from "../models/room.model";
import roomMemberModel, { RoomMember } from "../models/roomMember.model";

// Get friends by userId
const getFriendByUserId = async (req: Request, res: Response) => {
    const userId = req.params.id;

    console.log('userId', userId)

    try {
        const friendships = await Friend.find({
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
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch friends" });
    }
};

// Add friend
const addFriend = async (req: Request, res: Response) => {
    const { userId, friendEmail } = req.body;

    if (!userId || !friendEmail) {
      res.status(400).json({ error: "Missing required fields to add friend" });
      return
    }

    try {
        const friendUser = await userModel.getUserByEmail(friendEmail);

        if (!friendUser) {
          return res.status(404).json({ error: "Friend email not found" });
        }

        const friendUserId = friendUser._id;
        // sort
        const [user1Id, user2Id] =
            userId.toString() < friendUserId.toString() 
                ? [userId, friendUserId] 
                : [friendUserId, userId];

        // Duplicate check
        const existing = await Friend.findOne({ user1Id, user2Id });
        if (existing) {
          return res.status(409).json({ error: 'Already friends' });
        }

        // create friendship
        const friend = new Friend({ user1Id, user2Id });
        await friend.save();

        // create chat room for private
        const room = await roomModel.createPrivateRoom([user1Id, user2Id])
        // create member
        await roomMemberModel.createMembers(room._id, [user1Id, user2Id]);

        res.status(201).json(friend);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add friend' });
      }
  };

// Delete friend
const deleteFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ error: "Missing required fields to delete friend" });
    }

    try {
        // sort
        const [user1Id, user2Id] =
            userId.toString() < friendId.toString()
            ? [userId, friendId]
            : [friendId, userId];

        const deleted = await Friend.findOneAndDelete({ user1Id, user2Id });

        if (!deleted) {
            return res.status(404).json({ error: "Friendship not found" });
        }

        const roomName = `${user1Id}_${user2Id}`;
        const room = await Room.findOne({ name: roomName, isGroup: false });

        if (room) {
            // delete member
            await RoomMember.deleteMany({ roomId: room._id });
            // delete room
            await Room.findByIdAndDelete(room._id);
        }

        res.status(200).json({ message: "Friendship deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete friend" });
    }
  };

export default {
    getFriendByUserId,
    addFriend,
    deleteFriend,
};
