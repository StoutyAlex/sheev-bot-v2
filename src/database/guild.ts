import { IUser } from './user';
import mongoose, { Schema, Document } from 'mongoose';
import { prefix } from '../config';

interface IGuild extends Document {
    id: string;
    members: IUser['_id'][];
    prefix: string;
};

const GuildSchema: Schema = new Schema({
    id: { type: String },

    // membersData: { type: Object, default: {} }, // Members data of the guild
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    prefix: { type: String, default: prefix }, // Default or custom prefix of the guild
});

const GuildModel = mongoose.model<IGuild>('Guild', GuildSchema);

export { GuildModel, IGuild };
