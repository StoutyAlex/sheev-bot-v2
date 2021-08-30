import { Client as BotClient, ClientOptions, Collection, Snowflake } from "discord.js";
import { ServerQueue } from "./components/server-queue";
import * as config from './config';
import * as eventHandler from "./handlers/event-handler";
import { createLogger } from "./utils/logger";

class SheevBot extends BotClient {
    public logger = createLogger('sheev-bot-client');
    public readonly config = config;

    public readonly queue: Collection<Snowflake, ServerQueue> = new Collection();

    public constructor(opt: ClientOptions) {
        super(opt);
    }

    public async start(token: string) {
        eventHandler.load(this).catch(e => this.logger.error("LISTENER_LOADER_ERR:", e));

        await this.login(token);
        return this;
    }

    async login(token?: string | undefined): Promise<string> {
        const result = await super.login(token);
        this.logger.log('info', `Logged in as ${this.user?.username}`);

        return result;
    }
};

export { SheevBot };
