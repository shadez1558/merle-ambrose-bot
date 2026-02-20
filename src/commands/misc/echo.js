import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder, PermissionsBitField, MessageFlags } from 'discord.js';

import config from '../../data/config.json' with { type: 'json' };

export default {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Make Merle send a message')
        .addSubcommand((subcommand) => 
            subcommand
                .setName('text')
                .setDescription('Send a text message')
                .addStringOption((option) =>
                    option
                        .setName('string')
                        .setDescription('Message to send')
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('embed')
                .setDescription('Send a message embed')
                .addStringOption((option) =>
                    option
                        .setName('title')
                        .setDescription('Title of the embed')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('description')
                        .setDescription('Description of the embed')
                        .setRequired(false))
                .addStringOption((option) =>
                    option
                        .setName('image')
                        .setDescription('Image of the embed (URL)')
                        .setRequired(false))
                .addStringOption((option) =>
                    option
                        .setName('color')
                        .setDescription('Color of the embed')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Aqua', value: 'Aqua' },
                            { name: 'Blue', value: 'Blue' },
                            { name: 'Blurple', value: 'Blurple' },
                            { name: 'Dark Aqua', value: 'DarkAqua' },
                            { name: 'Dark Blue', value: 'DarkBlue' },
                            { name: 'Dark but not Black', value: 'DarkButNotBlack' },
                            { name: 'Dark Gold', value: 'DarkGold' },
                            { name: 'Dark Green', value: 'DarkGreen' },
                            { name: 'Dark Grey', value: 'DarkGrey' },
                            { name: 'Dark Navy', value: 'DarkNavy' },
                            { name: 'Dark Orange', value: 'DarkOrange' },
                            { name: 'Dark Purple', value: 'DarkPurple' },
                            { name: 'Dark Red', value: 'DarkRed' },
                            { name: 'Dark Vivid Pink', value: 'DarkVividPink' },
                            { name: 'Gold', value: 'Gold' },
                            { name: 'Green', value: 'Green' },
                            { name: 'Grey', value: 'Grey' },
                            { name: 'Light Grey', value: 'LightGrey' },
                            { name: 'Navy', value: 'Navy' },
                            { name: 'Not Quite Black', value: 'NotQuiteBlack' },
                            { name: 'Orange', value: 'Orange' },
                            { name: 'Purple', value: 'Purple' },
                            { name: 'Red', value: 'Red' },
                            { name: 'White', value: 'White' },
                            { name: 'Yellow', value: 'Yellow' },
                        ))
                .addBooleanOption((option) =>
                    option
                        .setName('timestamp')
                        .setDescription('Include a timestamp in the embed')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
    
    /**
     * 
     * @param {CommandInteraction} interaction
     */

    async execute (client, interaction) {
        if (interaction.options.getSubcommand() === 'text') {
            interaction.channel.send(interaction.options.getString('string'));
            
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Success!')
                .setDescription('Message sent successfully!')
                .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
                .setTimestamp()
            
            interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        } else {
            const embed = new EmbedBuilder().setTitle(interaction.options.getString('title'));
            
            if (interaction.options.getString('description') != null) {
                embed.setDescription(interaction.options.getString('description'));
            }

            if (interaction.options.getString('image') != null) {
                embed.setImage(interaction.options.getString('image'));
            }

            if (interaction.options.getString('color') != null) {
                embed.setColor(interaction.options.getString('color'));
            }

            if (interaction.options.getBoolean('timestamp')) {
                embed.setTimestamp();
            }
            
            interaction.channel.send({ embeds: [embed] });

            const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Success!')
                .setDescription('Embed sent successfully!')
                .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
                .setTimestamp()
            
            interaction.reply({ embeds: [successEmbed], flags: [MessageFlags.Ephemeral] });
        }
    },
};