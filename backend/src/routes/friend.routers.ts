import { Router } from "express";
import friendController from "../controllers/friend.controller";

const friendRouter = Router()

friendRouter.post('/', async (req, res) => { await friendController.addFriend(req, res) }); // ok
friendRouter.post('/delete', async (req, res) => { await friendController.deleteFriend(req, res) }); // ok
friendRouter.get('/:userId', async (req, res) => { await friendController.getFriendByUserId(req, res) }); // ok http://localhost:3500/friend/67fd455816b71ebab055dc05

export default friendRouter