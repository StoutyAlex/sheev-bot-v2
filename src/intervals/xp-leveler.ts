import { Guild } from "discord.js";
import { SheevBot } from "../base/sheev-bot";
import { xp } from "../config";
import { IUser, UserModel } from "../database/user";

export const getXPtoLevel = function (level = 1, deltaNext = 30) {
    return ((Math.pow(level, 2) - level) * deltaNext) / 2;
};

const getMembersInVoiceChannel = (guild: Guild) => {
    const members = guild.members.cache;
    const onlineMembers = members.filter(member => member.presence?.status !== 'offline');
    const membersInVoice = onlineMembers.filter(member => Boolean(member.voice.channel?.id));

    return membersInVoice;
}

const levelDatabaseUser = async (id: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ id });
    if (!user) return null;
    user.exp += xp.passivePerMinute;

    const xpToNextLevel = getXPtoLevel(user.level);
    console.log('User level:', user.level, 'User xp:', user.exp, 'xp to next level:', getXPtoLevel(user.level));

    if (user.exp >= xpToNextLevel) {
        user.level += 1
    };

    await user.save();
    return user;
}

const levelUpMembers = async (guild: Guild) => {
    const membersInVoice = getMembersInVoiceChannel(guild);
    membersInVoice.forEach(member => console.log(member.displayName));

    await Promise.all(membersInVoice.map(member => levelDatabaseUser(member.id)));
};

const xpLeveler = async (client: SheevBot) => {
    const oAuthGuilds = await client.guilds.fetch();
    const guilds = await Promise.all(oAuthGuilds.map(guild => guild.fetch()));
    
    guilds.forEach(levelUpMembers);
};

export { xpLeveler };
