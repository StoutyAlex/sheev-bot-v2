import { commandHandler } from "../handlers/command-handler";
import { Event } from "../types";

const execute: Event['execute'] = async (client, message) => {
    if (message.author.bot || message.channel.type !== "GUILD_TEXT") return message;

    if (message.content.toLowerCase().startsWith(client.config.prefix)) return commandHandler(client, message);
}

const message: Event = {
    name: 'messageCreate',
    execute,
};

export { message };
