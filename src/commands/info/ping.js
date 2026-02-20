import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder, Client } from 'discord.js';

import config from '../../data/config.json' with { type: 'json' };

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get Merle\'s reaction time'),
    
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute (client, interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Thinking...')
            .setDescription(`Pong! ${client.ws.ping}ms`)
            .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
            .setTimestamp()
        
        interaction.reply({ embeds: [embed] });
    },
};