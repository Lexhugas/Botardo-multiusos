const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const Marriage = require('../../Schemas/marriageSchema');
const { createEmbed } = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('divorce')
    .setDescription('Divorciar a una pareja')
    .addUserOption(o => o.setName('usuario').setDescription('Tu pareja').setRequired(true)),

  async execute(interaction) {
    const partner = interaction.options.getUser('usuario');
    const user = interaction.user;

    const marr = await Marriage.findOne({ $or: [
      { user1: user.id, user2: partner.id },
      { user1: partner.id, user2: user.id }
    ]});
    if (!marr) return interaction.reply({ content: 'No estabais casados.', ephemeral: true });

    await marr.delete();

    const role = interaction.guild.roles.cache.get(config.casadosRoleId);
    const m1 = await interaction.guild.members.fetch(user.id);
    const m2 = await interaction.guild.members.fetch(partner.id);

    if (m1.roles.cache.has(role.id)) await m1.roles.remove(role);
    if (m2.roles.cache.has(role.id)) await m2.roles.remove(role);

    const strip = s => s.replace(/ <3$/, '');
    await m1.setNickname(strip(m1.nickname || m1.user.username)).catch(() => {});
    await m2.setNickname(strip(m2.nickname || m2.user.username)).catch(() => {});

    const embed = createEmbed({
      title: '💔 Triste Noticia',
      description: `@everyone\n\n${user} y ${partner} ya no están casados. \n${user} le fue infiel a ${partner}`,
      color: 0xFF4500
    });

    await interaction.reply({ embeds: [embed] });
  }
};
