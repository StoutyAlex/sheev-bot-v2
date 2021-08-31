import { Client, Guild, Intents, User as DiscordUser, GuildMember } from "discord.js";
import { commands as sheevCommands } from "../commands";
import * as config from '../config';
import { GuildModel, IGuild } from "../database/guild";
import { UserModel, IUser } from "../database/user";
import { events } from "../events";
import { xpLeveler } from "../intervals/xp-leveler";
import { Command } from "./command";


class SheevBot extends Client {
    public readonly config = config;
    public readonly usersData = UserModel;
    public readonly guildsData = GuildModel;

    public commands: Command[] = [];

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
        this.on('ready', () => {
            this.commands = sheevCommands.map(cmd => new cmd(this));
        });

        Object.entries(events).forEach(([name, handler]) => {
            const eventHandler = new handler(this);
            this.on(name, (...args) => eventHandler.run(...args));
            console.log('Added new event for', name);
        });

        // setup intervals
        setInterval(() => xpLeveler(this), 5000);

        this.login(token);
        return this;
    }

    private async createUserInDatabase(user: DiscordUser | GuildMember, guild: Guild): Promise<IUser> {
        const userData = new this.usersData({ id: user.id, guildId: guild.id });
        await userData.save();
        return userData;
    }

    private async createGuildInDatabase(guild: Guild): Promise<IGuild> {
        const guildData = new this.guildsData({ id: guild.id });
        await guildData.save();
        return guildData;
    }

    async getGuild(guild: Guild) {
        const foundGuild = await this.guildsData.findOne({ id: guild.id });
        if (foundGuild) return foundGuild;

        const newGuild: IGuild = await this.createGuildInDatabase(guild);
        return newGuild;
    };

    async getUser(user: DiscordUser | GuildMember, guild: Guild): Promise<IUser> {
        const foundUser = await this.usersData.findOne({ id: user.id, guildId: guild.id });
        if (foundUser) return foundUser;

        const newUser = await this.createUserInDatabase(user, guild);
        const currentGuild = await this.getGuild(guild);

        currentGuild.members.push(newUser._id);
        await currentGuild.save();

        return newUser;
    };
};

export { SheevBot };
