const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Blacklist = require('../../Schemas/Blacklist.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unblacklist')
    .setDescription('✔️ Quita a un usuario de la blacklist.')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const entry = await Blacklist.findOne({ userId: user.id });

    if (!entry) {
      return interaction.reply({
        content: '❌ Este usuario no está en la blacklist.',
        ephemeral: true
      });
    }

    const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'blacklist');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (role && member) {
      await member.roles.remove(role).catch(() => {});
    }

    await Blacklist.deleteOne({ userId: user.id });

    const embed = new EmbedBuilder()
      .setColor('#00ff88')
      .setTitle('✅ Usuario Eliminado de Blacklist')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `╔════════════════════════════╗\n` +
        `                              \n` +
        `👤 **Usuario:** <@${user.id}> | \`${user.tag}\`\n` +
        `🆔 **ID:** \`${user.id}\`\n` +
        `🎉 **Staff:** ${interaction.member.displayName}\n` +
        `📤 **Estado:** ¡Ha sido removido de la blacklist!\n` +
        `                              \n` +
        `╚════════════════════════════╝`
      )
      .setFooter({ text: 'Blacklist removida correctamente', iconURL: interaction.guild.iconURL() })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
