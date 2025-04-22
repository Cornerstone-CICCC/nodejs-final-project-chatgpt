import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.get('/', userController.getUsers)
userRouter.post('/login', userController.loginUser)
userRouter.post('/signup', userController.addUser)
userRouter.get('/logout', userController.logout)
userRouter.get('/check-cookie', userController.checkCookie)
userRouter.get('/:userId', userController.getUserById)

export default userRouter