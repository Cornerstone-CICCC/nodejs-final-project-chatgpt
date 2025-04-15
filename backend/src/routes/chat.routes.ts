import { Router } from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = Router()

chatRouter.get('/:roomId', chatController.getMessageByRoomId)

export default chatRouter