import mongoose from 'mongoose';

interface User {
    id: string;
    guildId: string;
    exp: number;
    level: number;
    registeredAt: number;

    cooldowns: {
        work: number;
    };
}

const UserModel = mongoose.model<User>('User', new mongoose.Schema<User>({
        id: { type: String },
        guildId: { type: String },

        exp: { type: Number, default: 0 },
        level: { type: Number, default: 0 },

        registeredAt: { type: Number, default: Date.now() },

        cooldowns: {
            work: 0
        }
    })
);

export { UserModel as User };
