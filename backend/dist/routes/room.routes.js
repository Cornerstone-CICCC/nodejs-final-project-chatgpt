"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const roomRouter = (0, express_1.Router)();
roomRouter.get('/', room_controller_1.default.getAllRooms);
roomRouter.post('/', room_controller_1.default.createRoom);
roomRouter.get('/private', room_controller_1.default.getPrivateRooms);
roomRouter.get('/group', room_controller_1.default.getGroupRooms);
exports.default = roomRouter;
