import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import { StageChannel, TextChannel, VoiceChannel } from "discord.js";
import { SongManager } from "../managers/song-handler";

export enum loopMode {
    off = 0,
    one = 1,
    all = 2,

    // ALIASES
    queue = all,
    "*" = all,

    current = one,
    trackonly = one,

    none = off,
    disable = off
}

class ServerQueue {
    public connection: VoiceConnection | null = null;
    public currentPlayer: AudioPlayer | null = null;
    public volume = 0;
    public loopMode = loopMode.disable;
    public timeout: NodeJS.Timeout | null = null;

    public readonly songs = new SongManager();

    public textChannel: TextChannel | null = null;
    public voiceChannel: VoiceChannel | StageChannel | null = null;

    constructor(textChannel: TextChannel, voiceChannel: VoiceChannel | StageChannel) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
    };

    public get playing(): boolean {
        return this.currentPlayer!.state.status === AudioPlayerStatus.Playing;
    }
};

export { ServerQueue  };
