import { createAudioResource } from "@discordjs/voice";
import { Guild } from "discord.js";
import { SheevBot } from "../sheev-bot";
import { Command } from "../types";

const playSong = async (client: SheevBot, guild: Guild) => {
    const queue = client.queue.get(guild.id);
};

const execute: Command['execute'] = async (client, message, args) => {
};

const play: Command = {
    name: 'play',
    aliases: ['add'],
    admin: false,
    info: 'add the bot',
    usage: '{prefix}play',
    execute
};

export { play };