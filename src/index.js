import { config, validateEnv, z } from 'pushenv';
config({ path: '../.env.production' });

const env = validateEnv({
    schema: z.object({
        TOKEN: z.string()
    })
});

import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';

const myIntents = Object.keys(GatewayIntentBits).map((a) => { return GatewayIntentBits[a] });
const client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    
    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
    }
}

import './events/antiCrash.js';

client.login(env.TOKEN);