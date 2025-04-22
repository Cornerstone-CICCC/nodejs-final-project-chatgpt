import { Router } from "express";
import roomController from "../controllers/room.controller";

const roomRouter = Router()

roomRouter.get('/private/:userId', async (req, res) => { await roomController.getPrivateRooms(req, res) }); // ok (change false) http://localhost:3500/room/private/67fd455816b71ebab055dc05
roomRouter.get('/group/:userId', async (req, res) => { await roomController.getGroupRooms(req, res) }); // ok http://localhost:3500/room/group/67fd455816b71ebab055dc05
roomRouter.post('/group', async (req, res) => { await roomController.createGroupRoom(req, res) }); // ok
roomRouter.get('/:userId', async (req, res) => { await roomController.getAllRooms(req, res) }); // ok http://localhost:3500/room/67fd455816b71ebab055dc05


export default roomRouter