import mongoose, { Schema, Document } from 'mongoose';
import { Regions } from 'twisted/dist/constants';

interface LeagueUser extends Document {
    accountId: string | null;
    username: string | null;
    region: Regions | null;
    icon: number | null;
};

interface IUser extends Document {
    id: string;
    guildId: string;
    exp: number;
    level: number;
    registeredAt: number;

    leagueUser: LeagueUser

    cooldowns: {
        work: number;
    };
}

const UserSchema: Schema = new Schema({
    id: { type: String },
    guildId: { type: String },

    exp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },

    leagueUser: {
        accountId: { type: String },
        username: { type: String },
        region: { type: String },
        icon:{ type: Number },
    },

    registeredAt: { type: Number, default: Date.now() },

    cooldowns: {
        work: 0
    }
})

const UserModel = mongoose.model<IUser>('User', UserSchema);

export { UserModel, IUser };
