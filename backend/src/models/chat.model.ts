import mongoose, { Schema, Types, InferSchemaType, HydratedDocument } from 'mongoose';

export type ChatType = InferSchemaType<typeof ChatSchema>;
export type ChatDoc = HydratedDocument<ChatType>;

const ChatSchema = new Schema({
  roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message:  { type: String, required: true },
}, { timestamps: true })

export const Chat = mongoose.model('Chat', ChatSchema)

const createChat = async (
    roomId: string,
    senderId: string,
    message: string
) => {
    const chat = new Chat({
        roomId: new Types.ObjectId(roomId as string),
        senderId: new Types.ObjectId(senderId as string),
        message
    });
    return await chat.save();
};

export default {
    createChat,
}