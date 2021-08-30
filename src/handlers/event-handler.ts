import { message } from "../events/message";
import { SheevBot } from "../sheev-bot";
import { Event } from "../types";

// Add events to the list
export const events: Event[] = [
    message
];

const load = async (client: SheevBot) => {
    for (const event of events) {
        client.on(event.name, (...args) => event.execute(client, ...args));
        client.logger.info(`Listener for event ${event.name} has been loaded!`);
    }
};

export { load };
