"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const roomRouter = (0, express_1.Router)();
roomRouter.get('/private/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield room_controller_1.default.getPrivateRooms(req, res); })); // ok (change false) http://localhost:3500/room/private/67fd455816b71ebab055dc05
roomRouter.get('/group/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield room_controller_1.default.getGroupRooms(req, res); })); // ok http://localhost:3500/room/group/67fd455816b71ebab055dc05
roomRouter.post('/group', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield room_controller_1.default.createGroupRoom(req, res); })); // ok
roomRouter.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield room_controller_1.default.getAllRooms(req, res); })); // ok http://localhost:3500/room/67fd455816b71ebab055dc05
exports.default = roomRouter;
