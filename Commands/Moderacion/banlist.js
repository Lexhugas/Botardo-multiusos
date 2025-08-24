const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Ban = require('../../Schemas/Ban.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('📋 Muestra la lista de baneos registrados.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const bans = await Ban.find();

    if (bans.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('✅ Sin baneos')
            .setDescription('No hay baneos registrados actualmente.')
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('📄 Lista de Baneos Registrados')
      .setDescription('━━━━━━━━━━━━━━━━━━')
      .setFooter({ text: `Total: ${bans.length} baneos`, iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    bans.slice(0, 10).forEach(b => {
      embed.addFields({
        name: `🔢 ID: ${b.banId} | ${b.userTag}`,
        value: `👤 Staff: ${b.staffName}\n📝 Motivo: ${b.reason}`,
        inline: false
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};
