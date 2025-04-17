import { Request, Response } from "express";
import { Chat } from "../models/chat.model";

// get Message By Room Id
const  getMessageByRoomId = async (req: Request, res: Response) => {
  const { roomId } = req.params

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  try {
    console.log("start")
    const messages = await Chat.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("roomId")
    .populate("senderId","firstName lastName email");
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ error: "Failed to get messgae"})
  }
}

export default {
  getMessageByRoomId
}