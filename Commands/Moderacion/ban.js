const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Ban = require('../../Schemas/Ban.js');

function generateBanId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🚫 Banea a un usuario con motivo.')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo del baneo')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member || !member.bannable) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Error al banear')
            .setDescription(`No se puede banear a **${user.tag}**. Verifica los permisos o el rol.`)
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    const banId = generateBanId();

    await new Ban({
      banId,
      userId: user.id,
      userTag: user.tag,
      staffId: interaction.user.id,
      staffName: interaction.member.displayName,
      reason
    }).save();

    let dmStatus = '✅ Enviado correctamente';
    const dmEmbed = new EmbedBuilder()
      .setColor(0xFF4C4C)
      .setTitle('🚫 Has sido baneado')
      .setDescription(`━━━━━━━━━━━━━━━━━━`)
      .addFields(
        { name: '📄 Motivo', value: reason },
        { name: '🔢 ID de Baneo', value: `\`${banId}\`` }
      )
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    await user.send({ embeds: [dmEmbed] }).catch(() => {
      dmStatus = '❌ No se pudo enviar (MD cerrados)';
    });

    await member.ban({ reason });

    const modEmbed = new EmbedBuilder()
      .setColor(0xFFB86C)
      .setTitle('✅ Usuario Baneado')
      .setDescription(`━━━━━━━━━━━━━━━━━━`)
      .addFields(
        { name: '👤 Usuario', value: `${user.tag} (\`${user.id}\`)`, inline: false },
        { name: '📝 Motivo', value: reason, inline: false },
        { name: '🆔 ID de Baneo', value: `\`${banId}\``, inline: true },
        { name: '📬 Mensaje por MD', value: dmStatus, inline: true }
      )
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: `Baneado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [modEmbed] });
  }
};
