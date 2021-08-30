import { Message } from "discord.js";
import { SheevBot } from "../sheev-bot";

export interface Command {
    name: string;
    info: string;
    usage: string;
    aliases?: string[];
    admin? : boolean;
    execute: (client: SheevBot, message: Message, args: string[]) => any;
};

export type CommandHandler = (client: SheevBot, message: Message) => void;

export interface Event {
    name: string;
    execute: (client: SheevBot, ...args: any) => any;
};

declare module "discord.js" {
    // @ts-expect-error Override
    export interface Client extends OClient {
        readonly config: SheevBot["config"];
        readonly logger: SheevBot["logger"];
    
        start(token: string): Promise<this>;
    }
    // @ts-expect-error Override
    export interface Guild extends OGuild {
        // queue: ServerQueue | null;
    }
};
