import { ClientEvents, Message, VoiceState as IVoiceState } from "discord.js";
import { Event } from "../base/event";
import { SheevBot } from "../base/sheev-bot";
import { EventName } from "../types";

interface VoiceStateHandler {
    run: (...args: ClientEvents['voiceStateUpdate']) => any;
}

class VoiceState extends Event implements VoiceStateHandler {
    public static eventName: EventName = 'voiceStateUpdate';

    constructor(client: SheevBot) {
        super(client);
    }

    async run(oldState: IVoiceState, newState: IVoiceState) {
        const member = newState.member;
        if (member && newState) this.client.getUser(member, newState.guild);
    }
};

export { VoiceState };
