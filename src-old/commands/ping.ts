import { MessageEmbed, ColorResolvable } from "discord.js";
import { Command } from "../types";

const searchHex = (ms: string | number): ColorResolvable => {
    const listColorHex = [
        [0, 20, "#0DFF00"],
        [21, 50, "#0BC700"],
        [51, 100, "#E5ED02"],
        [101, 150, "#FF8C00"],
        [150, 200, "#FF6A00"]
    ];

    const defaultColor = "#FF0D00";

    const min = listColorHex.map(e => e[0]);
    const max = listColorHex.map(e => e[1]);
    const hex = listColorHex.map(e => e[2]);
    let ret: string | number = "#000000";

    for (let i = 0; i < listColorHex.length; i++) {
        if (min[i] <= ms && ms <= max[i]) {
            ret = hex[i];
            break;
        } else {
            ret = defaultColor;
        }
    }
    return ret as ColorResolvable;
}

const execute: Command['execute'] = async (client, message, args) => {
    try {
        const msg = await message.channel.send("🏓 Pong!");
    
        const latency = msg.createdTimestamp - message.createdTimestamp;
        const wsLatency = client.ws.ping.toFixed(0);
        const embed = new MessageEmbed()
            .setAuthor("🏓 PONG!", message.client.user?.displayAvatarURL())
            .setColor(searchHex(wsLatency))
            .addFields({
                name: "📶 API Latency",
                value: `**\`${latency}\`** ms`,
                inline: true
            }, {
                name: "🌐 WebSocket Latency",
                value: `**\`${wsLatency}\`** ms`,
                inline: true
            })
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        msg.edit({ content: " ", embeds: [embed] }).catch(e => console.error("PROMISE_ERR:", e));
        
    } catch (error) {
        console.error("PROMISE_ERR:", error);
    }

    return message;
};

const ping: Command = {
    name: 'ping',
    aliases: ['p', 'pong'],
    admin: false,
    info: 'Ping the bot',
    usage: '{prefix}ping',
    execute
};

export { ping };