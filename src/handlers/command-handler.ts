
import { TextChannel } from 'discord.js';
import { help, ping } from '../commands';
import { Command, CommandHandler } from '../types';

// Add new commands to the list
export const commands: Command[] = [
    ping,
    help
];

const commandHandler: CommandHandler = (client, message) => {
    const args = message.content.substring(client.config.prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    const command = commands.find(c => c.name === cmd || c.aliases?.includes(cmd!));
    if (!command) return undefined;

    try {
        return command.execute(client, message, args);
      } catch (e) {
        client.logger.error("CMD_HANDLER_ERR:", e);
    } finally {
        client.logger.info(`${message.author.tag} is using ${command.name} command on ${message.guild ? `${message.guild.name} in #${(message.channel as TextChannel).name} channel` : "DM Channel"}`);
    }
};

export { commandHandler };
