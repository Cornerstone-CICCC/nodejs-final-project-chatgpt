import { Router } from "express";
import roomController from "../controllers/room.controller";

const roomRouter = Router()

roomRouter.get('/', roomController.getAllRooms)
roomRouter.get('/private', roomController.getPrivateRooms)
roomRouter.post('/private', roomController.createPrivateRoom)
roomRouter.get('/group', roomController.getGroupRooms)
roomRouter.post('/group', roomController.createGroupRoom)


export default roomRouter