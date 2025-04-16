import { Request, Response } from "express";
import { Chat } from "../models/chat.model";

// get Message By Room Id
const  getMessageByRoomId = async (req: Request, res: Response) => {
  const { roomId } = req.params
  try {
    const messages = await Chat.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ error: "Failed to get messgae"})
  }
}

export default {
  getMessageByRoomId
}