import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';

import config from '../../data/config.json' with { type: 'json' };
import data from '../../data/bosses.json' with { type: 'json' };

export default {
    data: new SlashCommandBuilder()
        .setName('boss')
        .setDescription('Get information about a boss')
        .addStringOption((option) => 
            option
                .setName('boss-id')
                .setDescription('The boss to get information about (Enter list for a list of bosses)')
                .setRequired(true)),
    
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute (client, interaction) {
        if (interaction.options.getString("boss-id").toLowerCase() === "list") {
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Boss Name - Boss ID')
                .setDescription(data.bosses.map(b => b.name + " - " + b.id).join('\n'))
                .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
                .setTimestamp()
            
            interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        } else {
            try {
                const boss = data.bosses.find(b => b.id === interaction.options.getString("boss-id").toLowerCase());

                const embed = new EmbedBuilder()
                    .setTitle(boss.name)
                    .setDescription(boss.description)
                    .addFields(
                        { name: 'Health', value: boss.health.toString(), inline: false },
                        { name: 'Location', value: boss.world + " - " + boss.location, inline: false },
                        { name: 'School', value: boss.school, inline: false },
                        { name: 'Skeleton Key', value: boss.key_type, inline: false },
                        { name: 'Cheats', value: boss.cheats.join('\n\n'), inline: false },
                        { name: 'Drops', value: boss.notable_drops.join('\n'), inline: false },
                    )
                    .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
                    .setTimestamp()
                
                if (boss.key_type == "Wooden") {
                    embed.setColor('#8B4513');
                } else if (boss.key_type == "Gold") {
                    embed.setColor('Gold');
                } else if (boss.key_type == "Stone") {
                    embed.setColor('Grey');
                } else {
                    embed.setColor('Blue');
                }

                if (boss.minions.length > 0) {
                    embed.addFields({ name: 'Minions', value: boss.minions.map(m => `Name: ${m.name}\nHealth: ${m.health}\nCheats: ${m.cheats.join('\n') || 'None'}`).join('\n\n'), inline: false });
                }
                
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Error')
                    .setDescription('Could not find the specified boss. Please make sure you entered the correct boss name.')
                    .setFooter({ text: `Merle Ambrose | Age: ${config.version}` })
                    .setTimestamp()
                
                interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });

                console.log(error)
            }
        }
    },
};