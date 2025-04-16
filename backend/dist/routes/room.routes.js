"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const roomRouter = (0, express_1.Router)();
roomRouter.get('/', room_controller_1.default.getAllRooms);
roomRouter.get('/private', room_controller_1.default.getPrivateRooms);
roomRouter.post('/private', room_controller_1.default.createPrivateRoom);
roomRouter.get('/group', room_controller_1.default.getGroupRooms);
roomRouter.post('/group', room_controller_1.default.createGroupRoom);
exports.default = roomRouter;
