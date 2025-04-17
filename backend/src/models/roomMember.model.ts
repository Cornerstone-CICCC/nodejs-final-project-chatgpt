import mongoose, { Schema, Types, InferSchemaType, HydratedDocument } from 'mongoose';

export type RoomMemberType = InferSchemaType<typeof RoomMemberSchema>;
export type RoomMemberDoc = HydratedDocument<RoomMemberType>;


const RoomMemberSchema = new Schema({
  roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role:  { type: String },
}, { timestamps: true })

export const RoomMember = mongoose.model('RoomMember', RoomMemberSchema)

const createMembers = async (roomId: Types.ObjectId, users: string[]) => {
    const members = users.map(userId => ({
        roomId: roomId,
        userId: userId
    }));

    return await RoomMember.insertMany(members);
}

export default {
    createMembers,
}