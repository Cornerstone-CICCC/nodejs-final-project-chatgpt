"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const chatRouter = (0, express_1.Router)();
chatRouter.get('/:roomId', chat_controller_1.default.getMessageByRoomId);
exports.default = chatRouter;
