// commands/unban.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Ban = require('../../Schemas/Ban.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('🔓 Desbanea a un usuario por nombre o ID de baneo.')
    .addStringOption(opt =>
      opt.setName('identificador')
        .setDescription('ID de baneo o nombre de usuario (tag o ID)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const identifier = interaction.options.getString('identificador');
    const bans = await Ban.find();

    const banEntry = bans.find(b =>
      b.banId === identifier || b.userTag === identifier || b.userId === identifier
    );

    if (!banEntry) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Baneo no encontrado')
            .setDescription(`No se encontró ningún baneo con el identificador \`${identifier}\`.`)
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    let dmStatus = '✅ Enviado correctamente';
    let user;

    try {
      await interaction.guild.members.unban(banEntry.userId);
      await Ban.deleteOne({ banId: banEntry.banId });

      user = await interaction.client.users.fetch(banEntry.userId).catch(() => null);

      const dmEmbed = new EmbedBuilder()
        .setColor(0x00C48C)
        .setTitle('🔓 Has sido desbaneado')
        .setDescription(`━━━━━━━━━━━━━━━━━━`)
        .addFields(
          { name: '📜 Servidor', value: interaction.guild.name },
          { name: '🆔 ID de Baneo', value: `\`${banEntry.banId}\`` }
        )
        .setFooter({ text: 'Puedes volver a entrar si lo deseas.', iconURL: interaction.guild.iconURL() })
        .setTimestamp();

      if (user) {
        await user.send({ embeds: [dmEmbed] }).catch(() => {
          dmStatus = '❌ No se pudo enviar (MD cerrados)';
        });
      } else {
        dmStatus = '⚠️ Usuario no encontrado (posible bot o eliminado)';
      }

      const successEmbed = new EmbedBuilder()
        .setColor(0x00FF99)
        .setTitle('✅ Usuario Desbaneado')
        .setDescription(`━━━━━━━━━━━━━━━━━━`)
        .addFields(
          { name: '👤 Usuario', value: `${banEntry.userTag} (\`${banEntry.userId}\`)`, inline: false },
          { name: '🆔 ID de Baneo', value: `\`${banEntry.banId}\``, inline: true },
          { name: '📬 Mensaje por MD', value: dmStatus, inline: true }
        )
        .setFooter({ text: `Desbaneado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

    } catch (error) {
      console.error(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('⚠️ Error al desbanear')
            .setDescription(`No se pudo desbanear al usuario. Verifica que esté realmente baneado.`)
            .setTimestamp()
        ],
        ephemeral: true
      });
    }
  }
};
