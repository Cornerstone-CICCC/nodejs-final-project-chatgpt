import { Router } from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = Router()

chatRouter.get('/:roomId', async (req, res) => { await chatController.getMessageByRoomId(req, res) }); // ok http://localhost:3500/chat/67ffef282a349b665dfb9b8d

export default chatRouter