const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const StaffPoints = require('../../Schemas/staffPoints');
const HEAD_STAFF_ROLE_ID = '1387409810579914762';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('añadirpuntos')
    .setDescription('Añade puntos a un staff. Máximo 55 por uso.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) 
    .addUserOption(option => option.setName('usuario').setDescription('Usuario al que añadir puntos').setRequired(true))
    .addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad de puntos (máx 55)').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(HEAD_STAFF_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    let cantidad = interaction.options.getInteger('cantidad');

    if (cantidad > 55) cantidad = 55;

    await StaffPoints.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: user.id },
      { $inc: { points: cantidad } },
      { upsert: true }
    );

    await interaction.reply({ content: `✅ Se añadieron ${cantidad} puntos a ${user.tag}.`, ephemeral: true });
  }
};
