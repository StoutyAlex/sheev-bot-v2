import { ClientEvents } from "discord.js";
import { Event } from "../base/event";
import { VoiceState } from "./voice-state";

const events: {[property in keyof Partial<ClientEvents>]: typeof Event} = {
    'voiceStateUpdate': VoiceState
};

export { events };
