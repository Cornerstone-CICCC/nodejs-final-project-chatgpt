import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { Friend } from "../models/friend.model";
import { RoomMember } from "../models/roomMember.model";
import { Types } from "mongoose";

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

// create Room
const createRoom = async (req: Request, res: Response) => {
  const { name, isGroup } = req.body

  if (typeof name !== 'string' || typeof isGroup !== 'boolean') {
    res.status(400).json({ error: "Invalid data format" });
    return
  }

  // private room
  if (!isGroup) {
    const ids = name.split('_');
    if (ids.length !== 2 || !Types.ObjectId.isValid(ids[0]) || !Types.ObjectId.isValid(ids[1])) {
      res.status(400).json({ error: "Invalid private room name format" });
      return
    }

    const [id1, id2] = ids.sort();

    try {
      // check is friend or not
      const isFriend = await Friend.findOne({ user1Id: id1, user2Id: id2 });
      if (!isFriend) {
        res.status(403).json({ error: "Users are not friends" });
        return
      }

      // check private room is exis?
      const existing = await Room.findOne({ name: `${id1}_${id2}`, isGroup: false });
      if (existing) {
        res.status(400).json({ error: "Private room already exists" });
        return
      }
      const newRoom = new Room({ name: `${id1}_${id2}`, isGroup: false });
      const savedRoom = await newRoom.save();

      await RoomMember.create([
        { roomId: savedRoom._id, usrId: id1 },
        { roomId: savedRoom._id, usrId: id2 },
      ]);

      res.status(201).json(savedRoom);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create private room" });
    }
  }

  // group room
  try {
    const existing = await Room.findOne({ name, isGroup: true });
    if (existing) {
      res.status(400).json({ error: "Group room already exists" });
      return
    }

    const newRoom = new Room({ name, isGroup: true });
    const saveRoom = await newRoom.save();
    res.status(201).json(saveRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group room" });
  }
}



export default {
  getAllRooms,
  getPrivateRooms,
  getGroupRooms,
  createRoom
}