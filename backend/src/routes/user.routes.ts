import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.get('/', userController.getUsers)
userRouter.get('/check-auth', userController.getUserByEmail)
userRouter.post('/login', userController.loginUser)
userRouter.post('/singup', userController.addUser)
userRouter.get('/logout', userController.logout)
userRouter.get('/check-cookie', userController.checkCookie)

export default userRouter