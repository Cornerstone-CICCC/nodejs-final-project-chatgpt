import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { Friend } from "../models/friend.model";
import { RoomMember } from "../models/roomMember.model";
import { Types } from "mongoose";
import { IUser } from "../models/user.model";

// get All Rooms
const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find()
    res.status(200).json(rooms)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rooms" })
  }
}

// get Private Rooms
const getPrivateRooms = async (req: Request, res: Response) => {
  try {
    const privateRooms = await Room.find({ isGroup: false });
    res.status(200).json(privateRooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Private Rooms" })
  }
}

// get Group Rooms
const getGroupRooms = async (req: Request, res: Response) => {
  try {
    const groupRooms = await Room.find({ isGroup: true });
    res.status(200).json(groupRooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to Group Rooms" })
  }
}

// CreateRoom

// createPrivateRoom
const createPrivateRoom = async (users: Array<IUser>) => {

  if (users.length !== 2) {
    console.log("Private room must have exactly 2 users" );
    return;
  }

  const [id1, id2] = users[0]._id < users[1]_id ? [users[0]._id, users[1]._id] : users[1]_id ? [users[1]._id, users[0]._id]; 
  if (!Types.ObjectId.isValid(id1) || !Types.ObjectId.isValid(id2)) {
    console.log("Invalid user IDs");
    return;
  }

  // check friends or not
  const areFriends = await Friend.findOne({
    $or: [
      { user1Id: id1, user2Id: id2 },
      { user1Id: id2, user2Id: id1 }
    ]
  });

  if (!areFriends) {
    console.log( "Users are not friends" );
    return;
  }

  const name = `${id1}_${id2}`;
  await createRoom(res, name, false, [id1, id2]);
};


// createGroupRoom
const createGroupRoom = async (req: Request, res: Response) => {
  const { name, users } = req.body;

  if (typeof name !== 'string' || !Array.isArray(users) || users.length < 2) {
    res.status(400).json({ error: "Invalid group room data" });
    return;
  }

  await createRoom(res, name, true, users);

  res.status(200).json()
};


// createRoom
const createRoom = async (
  name: string,
  isGroup: boolean,
  users: string[]
) => {
  try {
    const existing = await Room.findOne({ name, isGroup });
    if (existing) {
      console.log("Room already exists" );
      return;
    }

    const newRoom = new Room({ name, isGroup });
    const savedRoom = await newRoom.save();

    // RoomMember
    const members = users.map((userId) => ({
      roomId: savedRoom._id,
      usrId: userId,
      role: isGroup ? "member" : "participant"
    }));

    await RoomMember.insertMany(members);

    res.status(201).json(savedRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};



export default {
  getAllRooms,
  getPrivateRooms,
  getGroupRooms,
  createPrivateRoom,
  createGroupRoom
}