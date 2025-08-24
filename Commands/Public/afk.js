const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../Schemas/afkSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('💤 Cambia a estado **AFK** en el servidor')
        .addSubcommand(command =>
            command
                .setName('set')
                .setDescription('💤 Establecer estado AFK')
                .addStringOption(option =>
                    option.setName('motivo')
                        .setDescription('📝 Mensaje al estar en AFK')
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName('remove')
                .setDescription('❌ Salir del estado AFK')
        ),

    async execute(interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

        switch (sub) {
            case 'set':
                if (Data) {
                    return await interaction.reply({
                        content: '⚠️ Ya estás en estado **AFK** en el servidor.',
                        ephemeral: true
                    });
                }

                const motivo = options.getString('motivo');
                const nickname = interaction.member.nickname || interaction.user.username;

                await afkSchema.create({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Message: motivo,
                    Nickname: nickname,
                    Timestamp: Date.now()
                });

                const afkNickName = `「AFK」 ${nickname}`;
                await interaction.member.setNickname(afkNickName).catch(() => {});

                const embedSet = new EmbedBuilder()
                    .setColor('#007FFF') 
                    .setTitle('💤 Estado AFK Activado')
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setDescription(`🌀 **¡Ahora estás en modo AFK!**`)
                    .addFields(
                        { name: '👤 Usuario:', value: `${interaction.user.tag}`, inline: true },
                        { name: '📝 Motivo:', value: motivo, inline: true },
                        { name: '⏰ Tiempo:', value: 'Desde ahora mismo', inline: false }
                    )
                    .setFooter({ text: 'Usa /afk remove para desactivar el estado AFK.' })
                    .setTimestamp();

                await interaction.reply({ embeds: [embedSet] });
                break;

            case 'remove':
                if (!Data) {
                    return await interaction.reply({
                        content: '⚠️ No estás en estado **AFK** actualmente.',
                        ephemeral: true
                    });
                }

                const nick = Data.Nickname;
                await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id });
                await interaction.member.setNickname(nick).catch(() => {});

                let afkTime = 'Desconocido';
                if (Data.Timestamp) {
                    afkTime = Math.floor((Date.now() - Data.Timestamp) / 60000) + ' minutos';
                }

                const embedRemove = new EmbedBuilder()
                    .setColor('#007FFF') 
                    .setTitle('❌ Estado AFK Desactivado')
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setDescription(`✅ **Has salido del modo AFK!** Bienvenido de vuelta.`)
                    .addFields(
                        { name: '👤 Usuario:', value: `${interaction.user.tag}`, inline: true },
                        { name: '🕒 Tiempo AFK:', value: afkTime, inline: true },
                        { name: '📝 Motivo del AFK:', value: Data.Message || 'No especificado', inline: false }
                    )
                    .setFooter({ text: 'Nos alegra tenerte de vuelta 💙' })
                    .setTimestamp();

                await interaction.reply({ embeds: [embedRemove], ephemeral: true });
                break;
        }
    }
};
