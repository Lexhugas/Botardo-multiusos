const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const blacklistSchema = require('../../Schemas/Blacklist.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackinfo')
    .setDescription('📋 Muestra la lista de usuarios en blacklist'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const blacklist = await blacklistSchema.find({ guildId: interaction.guild.id });

    if (!blacklist.length) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Lista limpia')
            .setDescription('🎉 No hay usuarios en la blacklist de este servidor.')
            .setFooter({ text: 'Sistema de Blacklist', iconURL: interaction.client.user.displayAvatarURL() })
        ]
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🚫 Lista de Usuarios Blacklisteados')
      .setThumbnail('https://i.imgur.com/lG8EbdB.png') 
      .setFooter({
        text: `Total: ${blacklist.length} usuarios`,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    const list = await Promise.all(blacklist.map(async entry => {
      const user = await interaction.client.users.fetch(entry.userId).catch(() => null);
      const staff = await interaction.client.users.fetch(entry.staffId).catch(() => null);

      return (
        `╔════════════════════════════╗\n` +
        `                              \n` +
        `👤 **Usuario:** ${user ? `${user.username} (${user.id})` : entry.userId}\n` +
        `📌 **Motivo:** ${entry.reason || 'No especificado'}\n` +
        `🛡️ **Staff:** ${staff ? staff.username : 'Desconocido'}\n` +
        `🖼️ **Avatar:** ${user ? `[Click aquí](${user.displayAvatarURL({ dynamic: true })})` : 'No disponible'}\n` +
        `                              \n` +
        `╚════════════════════════════╝`
      );
    }));

    embed.setDescription(list.join('\n\n'));

    interaction.editReply({ embeds: [embed] });
  }
};
