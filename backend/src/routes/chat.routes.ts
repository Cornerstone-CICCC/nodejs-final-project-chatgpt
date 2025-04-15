import { Router } from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = Router()

chatRouter.get('/:id', chatController.getMessageByRoomId)

export default chatRouter