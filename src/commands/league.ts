import { BufferResolvable, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { create } from "lodash";
import { Regions } from "twisted/dist/constants";
import { Command, CommandMeta } from "../base/command";
import { SheevBot } from "../base/sheev-bot";
import { createEmbed } from "../utils/create-embed";
import { createMatchEmbed } from "../utils/html-embed";
import { getChampionIcon, getForm, getLane, getSummoner, getSummonerIcon } from "../utils/league";

const meta: CommandMeta = {
    name: 'league',
    alieses: ['lol'],
};

class LeagueCommand extends Command {
     constructor (client: SheevBot) {
        super(client, meta);
    }

    async run(message: Message, ...args: string[]) {
        const subCommand = args[0];

        if (!message.member || !message.guild) return;

        if (subCommand === 'form') {
            const user = await this.client.getUser(message.member, message.guild);

            if (!user.leagueUser.accountId || !user.leagueUser.region) {
                return message.channel.send({ embeds: [createEmbed('error', 'Account not linked')] });
            }

            const form = await getForm(user.leagueUser.accountId, user.leagueUser.region);

            const embeds = form.map(match => {
                const kda = `${match.k}/${match.d}/${match.a}`;
                const champ = match.champion.name;
                const emoji = match.win ? ':green_circle:' : ':red_circle:';
                const lane = getLane(match.lane);

                return createEmbed('info').setColor(match.win ? 'GREEN' : 'RED')
                    .addField('Champion', `\`${champ}\``, true)
                    .addField('Lane', `\`${lane}\``, true)
                    .addField('K/D/A', `\`${kda}\``, true)
                    .setFooter(user.leagueUser.username!, getChampionIcon(match.champion.key))
            });

            // const summary = createEmbed('info', `based on your last ${form.length} matches`)
            //     .addField('Quick Summary', form.map(match => match.win ? ':green_circle:' : ':red_circle:').join(' '), false)]

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle('Your previous 5 Matches')
                .setColor('BLUE')
                .setAuthor(user.leagueUser.username!, getSummonerIcon(user.leagueUser.icon!))
                .setFields([
                  {
                    name: `:red_circle: Lux - Normal`,
                    value: "```Lane: BOT \nK/D/A: 10/2/19```",
                    inline: false
                  },
                  {
                    name: `:red_circle: Lux - Normal`,
                    value: "```Lane: BOT \nK/D/A: 10/2/19```",
                    inline: false
                  },
                  {
                    name: `:green_circle: Lux - Normal`,
                    value: "```Lane: BOT \nK/D/A: 10/2/19```",
                    inline: false
                  },
                  {
                    name: `:red_circle: Lux - Normal`,
                    value: "```Lane: BOT \nK/D/A: 10/2/19```",
                    inline: false
                  },
                  {
                    name: `:red_circle: Lux - Normal`,
                    value: "```Lane: BOT \nK/D/A: 10/2/19```",
                    inline: false
                  },
                ]);

            const image = await createMatchEmbed(user.leagueUser.username!, user.leagueUser.icon!, form);

            return message.channel.send({ files: [{ attachment: image }]});
        }

        if (subCommand === 'link') {
            const username = args[1] || null;
            const region = args[2] || null;

            if (args[3]) {
                return message.channel.send({ embeds: [createEmbed('error', 'If your name has spaces replace them with `_`')] });
            }

            if (!username || !region) {
                return message.channel.send({ embeds: [createEmbed('error', 'Invalid params')] });
            }

            const regionTyped = region as keyof typeof Regions;
            const leagueRegion = Regions[regionTyped];

            if (!leagueRegion) {

                const regions = [];
                for (const x in Regions) {
                    regions.push(x);
                }

                return message.channel.send({ embeds: [
                    createEmbed('error')
                        .setTitle('Invalid Region')
                        .addField('Valid Regions', regions.map(r => `\`${r}\``).join(' '))
                ] });
            };

            const user = await this.client.getUser(message.member, message.guild);

            if (user.leagueUser.username && user.leagueUser.region) {
                return message.channel.send({ embeds: [createEmbed('error', 'Account already linked')] });
            }

            const fixedUsername = username.replace(/_/, ' ');

            const summoner = await getSummoner(fixedUsername, leagueRegion);

            if (!summoner) {
                return message.channel.send({ embeds: [createEmbed('error', 'Summoner not found')] });
            }

            user.leagueUser.username = fixedUsername;
            user.leagueUser.region = leagueRegion;
            user.leagueUser.accountId = summoner.accountId;
            user.leagueUser.icon = summoner.profileIconId;

            await user.save();

            return message.channel.send({
                embeds: [
                    createEmbed("info")
                        .setTitle(`Summoner Linked!`)
                        .setThumbnail(getSummonerIcon(summoner.profileIconId))
                        .addFields([
                            { name: "Name", value: `\`${summoner.name}\``, inline: true },
                            { name: "Level", value: `\`${summoner.summonerLevel}\``, inline: true },
                            { name: "Region", value: `\`${region}\``, inline: true },
                        ])
                ]
            });
        }

        if (subCommand === 'unlink') {
            const user = await this.client.getUser(message.member, message.guild);

            user.leagueUser.username = null;
            user.leagueUser.region = null;
            user.leagueUser.accountId = null;
            user.leagueUser.icon = null;

            await user.save();

            return message.channel.send({ embeds: [createEmbed('info', 'Account unlinked')] });
        }
    }
};

export { LeagueCommand };
