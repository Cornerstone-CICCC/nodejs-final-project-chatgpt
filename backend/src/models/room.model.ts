import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';

export type RoomType = InferSchemaType<typeof RoomSchema>;
export type RoomDoc = HydratedDocument<RoomType>;

const RoomSchema = new Schema({
  name:  { type: String, required: true },
  isGroup: { type: Boolean, required: true },
}, { timestamps: true })

export const Room = mongoose.model('Room', RoomSchema)

const createPrivateRoom = async (users: string[]) => {
    if (users.length !== 2) {
      throw new Error("Private room must have exactly 2 users");
    }

    const [user1, user2] = users.sort();

    return await createRoom(`${user1}_${user2}`, false)
};

const createGroupRoom = async (name: string) => {
    return await createRoom(name, true)
};

const createRoom = async (
    name: string,
    isGroup: boolean,
): Promise<RoomDoc> => {
    const room = new Room({ name, isGroup });
    return await room.save();
};


export default {
    createPrivateRoom,
    createGroupRoom,
}