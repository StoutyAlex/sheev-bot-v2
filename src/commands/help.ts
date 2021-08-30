import { commands } from "../handlers/command-handler";
import { Command } from "../types";
import { createEmbed } from "../utils/create-embed";

const execute: Command['execute'] = async (client, message, args) => {
    const command = commands.find(c => c.name === args[0] || c.aliases?.includes(args[0]));

    if (command) {
        return await message.channel.send({
            embeds: [
              createEmbed("info")
                .setTitle(`Information for the ${command.name} command`)
                // .setThumbnail("https://raw.githubusercontent.com/Hazmi35/jukebox/main/.github/images/question_mark.png")
                .addFields([
                  { name: "Name", value: `\`${command.name}\``, inline: true },
                  { name: "Description", value: command.info!, inline: true },
                  { name: "Aliases", value: `${Number(command.aliases?.length) > 0 ? command.aliases?.map(c => `\`${c}\``).join(", ") as string : "None."}`, inline: true },
                  { name: "Usage", value: `\`${command.usage?.replace(/{prefix}/g, message.client.config.prefix) as string}\``, inline: false }
                ])
            ]
        }).catch(e => client.logger.error("HELP_CMD_ERR:", e));
    }

    return await message.channel.send({
        embeds: [
          createEmbed("info", commands.filter(cmd => cmd.name !== "eval").map(c => `\`${c.name}\``).join(" "))
            .setTitle("Help Menu")
            .setThumbnail(message.client.user?.displayAvatarURL() as string)
            .setFooter(`Use ${message.client.config.prefix}help <command> to get more info on a specific command!`, "https://raw.githubusercontent.com/Hazmi35/jukebox/main/.github/images/info.png")
        ]
      }).catch(e => client.logger.error("HELP_CMD_ERR:", e));

};

const help: Command = {
    name: 'help',
    aliases: ['h', 'halp'],
    admin: false,
    info: 'help the bot',
    usage: '{prefix}help',
    execute
};

export { help };