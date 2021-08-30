import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    id: string;
    guildId: string;
    exp: number;
    level: number;
    registeredAt: number;

    cooldowns: {
        work: number;
    };
}

const UserSchema: Schema = new Schema({
    id: { type: String },
    guildId: { type: String },

    exp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },

    registeredAt: { type: Number, default: Date.now() },

    cooldowns: {
        work: 0
    }
})

const UserModel = mongoose.model<IUser>('User', UserSchema);

export { UserModel, IUser };
