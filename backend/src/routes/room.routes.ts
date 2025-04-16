import { Router } from "express";
import roomController from "../controllers/room.controller";

const roomRouter = Router()

roomRouter.get('/', roomController.getAllRooms)
roomRouter.post('/', roomController.createRoom)
roomRouter.get('/private', roomController.getPrivateRooms)
roomRouter.get('/group', roomController.getGroupRooms)

export default roomRouter