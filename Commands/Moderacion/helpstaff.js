// NO ACTUALIZADO

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('helpstaff')
        .setDescription('Muestra una lista de comandos para el staff del servidor.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📋Lista de comandos para el Staff')
            .setColor(0xFFA500) 
            .setDescription('Aquí están los comandos disponibles para los moderadores y administradores de este servidor:')
            .addFields(
                { name: '**/warn**', value: 'Advierte a un usuario con una regla o motivo específico.' },
                { name: '**/warnings**', value: 'Muestra las advertencias de un usuario.' },
                { name: '**/unwarn**', value: 'Elimina una advertencia de un usuario.' },
                { name: '**/kick**', value: 'Expulsa a un usuario del servidor.' },
                { name: '**/ban**', value: 'Banea a un usuario del servidor.' },
                { name: '**/mute**', value: 'Silencia a un usuario para evitar que hable en los canales.' },
                { name: '**/clear**', value: 'Elimina una cantidad de mensajes del 1-99.' },
            )
            .setFooter({ text: '🛡️ Sistema de Moderación' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
