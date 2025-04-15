import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import bcrypt from "bcrypt";
import { error } from "console";

// get Message By Room Id
const  getMessageByRoomId = async (req: Request, res: Response) => {
  const { roomId } = req.params
  try {
    const message = await Chat.findById( roomId )
    if (!message) {
      res.status(404).json({ error: "Message not found" })
      return
    }
    res.status(200).json(message)
  } catch (err) {
    res.status(500).json({ error: "Failed to get messgae"})
  }
}

export default {
  getMessageByRoomId
}