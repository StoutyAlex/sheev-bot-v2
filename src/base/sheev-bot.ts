import { Client, Guild, Intents, User as DiscordUser } from "discord.js";
import * as config from '../config';
import { User } from "../database/user";
import { events } from "../events";

class SheevBot extends Client {
    public readonly config = config;
    public readonly usersData = User;

    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.DIRECT_MESSAGES
            ],
            allowedMentions: {
				parse: ["users"]
			}
        });
    }

    async start(token: string) {
        Object.entries(events).forEach(([name, handler]) => {
            const eventHandler = new handler(this);
            this.on(name, (...args) => eventHandler.run(...args));
            console.log('Added new event for', name);
        });

        this.login(token);
        return this;
    }

    private async createUserInDatabase(user: DiscordUser) {
        const userData = new this.usersData({ id: user.id });
        await userData.save();
    }

    async getUser(user: DiscordUser, guild: Guild) {
        const foundUser = await this.usersData.findOne({ id: user.id, guildId: guild.id });
        if (foundUser) return foundUser;

        const newUser = await this.createUserInDatabase(user);
        return newUser;
    };
};

export { SheevBot };
