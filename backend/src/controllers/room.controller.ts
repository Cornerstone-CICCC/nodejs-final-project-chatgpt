import { Request, Response } from "express";
import roomModel, { Room } from "../models/room.model";
import roomMemberModel, { RoomMember } from "../models/roomMember.model";

// get All Rooms
const getAllRooms = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Get memberships that user joined
    const memberships = await RoomMember.find({ userId });

    // Get roomId
    const roomIds = memberships.map(m => m.roomId);

    // Get room info
    const rooms = await Room.find({ _id: { $in: roomIds } });

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// get Private Rooms
const getPrivateRooms = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Get memberships that user joined
    const memberships = await RoomMember.find({ userId });

    // Get roomId
    const roomIds = memberships.map(m => m.roomId);

    // Get room info
    const rooms = await Room.find({ _id: { $in: roomIds }, isGroup: false });

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

// get Group Rooms
const getGroupRooms = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Get memberships that user joined
    const memberships = await RoomMember.find({ userId });

    // Get roomId
    const roomIds = memberships.map(m => m.roomId);

    // Get room info
    const rooms = await Room.find({ _id: { $in: roomIds }, isGroup: true });

    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

// createGroupRoom
const createGroupRoom = async (req: Request, res: Response) => {
  const { name, users } = req.body;

  if (!name || !users || users.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const room = await roomModel.createGroupRoom(name);
    const member = await roomMemberModel.createMembers(room._id, users);

    res.status(201).json({room, member});
  } catch (err) {
    console.error("Failed to create group room:", err);
    res.status(500).json({ error: "Failed to create group room" });
  }
};

export default {
  getAllRooms,
  getPrivateRooms,
  getGroupRooms,
  createGroupRoom,
}