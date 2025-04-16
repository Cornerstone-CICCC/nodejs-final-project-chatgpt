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
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
// get Message By Room Id
const getMessageByRoomId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    try {
        const messages = yield chat_model_1.Chat.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to get messgae" });
    }
});
exports.default = {
    getMessageByRoomId
};
