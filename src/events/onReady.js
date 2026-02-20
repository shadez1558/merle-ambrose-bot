import { Client, Collection, MessageFlags, Events } from 'discord.js';
import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import botConfig from '../data/config.json' with { type: 'json' };

import ascii from 'ascii-table';
const table = new ascii().setHeading('Command', 'Status');

import { config, validateEnv, z } from 'pushenv';
config({ path: '../../.env.production' });

const env = validateEnv({
    schema: z.object({
        TOKEN: z.string(),
        CLIENT_ID: z.string(),
        GUILD_ID: z.string()
    })
});

const token = env.TOKEN;
const clientId = env.CLIENT_ID;
const guildId = env.GUILD_ID;

export default {
    name: 'clientReady',
    once: true,

    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setActivity(`${client.guilds.cache.get(guildId).memberCount - 1} Wizards`, { type: 'WATCHING' });

        const categories = [
            'info',
            'misc'
        ];

        const commands = [];
        const commands_information = new Collection();

        for (var i = 0; i < readdirSync('./commands').length; i++) {
            const commandFiles = readdirSync(`./commands/${categories[i]}`).filter((file) => file.endsWith('.js'));

            for (const file of commandFiles) {
                const { default: command } = await import(`../commands/${categories[i]}/${file}`);
                table.addRow(command.data.name, '✅');
                commands.push(command.data.toJSON());
                commands_information.set(command.data.name, command);
            }
        }

        console.log(table.toString());

        const rest = new REST({ version: '10' }).setToken(token);

        (async () => {
            try {
                console.log("Started refreshing application (/) commands.");

                await rest.put(Routes.applicationCommands(clientId), { body: commands });

                console.log("Successfully reloaded application (/) commands.");
                console.log("-----------------------------------------------");
            } catch (error) {
                console.error(error);
            }
        })();

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;

            if (!commands_information.has(commandName)) return;

            try {
                await commands_information.get(commandName).execute(client, interaction, botConfig);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error executing this command!", flags: [MessageFlags.Ephemeral] });
            }
        });

        client.on(Events.GuildMemberAdd, (member) => {
            if (member.guild.id !== guildId) return;
            client.user.setActivity(`${member.guild.memberCount - 1} Wizards`, { type: 'WATCHING' });
        });

        client.on(Events.GuildMemberRemove, (member) => {
            if (member.guild.id !== guildId) return;
            client.user.setActivity(`${member.guild.memberCount - 1} Wizards`, { type: 'WATCHING' });
        });
    },
};