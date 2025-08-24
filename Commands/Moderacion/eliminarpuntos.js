const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const StaffPoints = require('../../Schemas/staffPoints');
const HEAD_STAFF_ROLE_ID = '1387409810579914762';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eliminarpuntos')
    .setDescription('Quita puntos a un staff.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option => option.setName('usuario').setDescription('Usuario al que quitar puntos').setRequired(true))
    .addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad de puntos a quitar').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(HEAD_STAFF_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    let cantidad = interaction.options.getInteger('cantidad');

    const doc = await StaffPoints.findOne({ guildId: interaction.guild.id, userId: user.id });
    if (!doc) {
      return interaction.reply({ content: `${user.tag} no tiene puntos registrados.`, ephemeral: true });
    }

    const nuevosPuntos = Math.max(doc.points - cantidad, 0);
    doc.points = nuevosPuntos;
    await doc.save();

    await interaction.reply({ content: `✅ Se quitaron ${cantidad} puntos a ${user.tag}. Ahora tiene ${nuevosPuntos} puntos.`, ephemeral: true });
  }
};
