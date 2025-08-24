const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MessagesCount = require('../../Schemas/MessagesCount.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mensajes')
    .setDescription('📊 Muestra el top 10 de usuarios que más mensajes han enviado en el servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel), 

  async execute(interaction) {
    const guildId = interaction.guild.id;

    const topUsers = await MessagesCount.find({ guildId })
      .sort({ count: -1 })
      .limit(10);

    if (!topUsers.length) {
      return interaction.reply({ content: '❌ No hay datos de mensajes en este servidor.', ephemeral: true });
    }

    let description = '╔══════════════════════════════╗\n\n';
    description += '      📋 **Top 10 Mensajeros**\n\n';
    topUsers.forEach((user, i) => {
      description += `  ${i + 1}. ${user.username || '<Usuario no encontrado>'} - 📝 ${user.count} mensajes\n`;
    });
    description += '\n╚══════════════════════════════╝';

    const embed = new EmbedBuilder()
      .setTitle(`📊 Top Mensajeros de ${interaction.guild.name}`)
      .setColor(0x00BFFF)
      .setDescription(description)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
