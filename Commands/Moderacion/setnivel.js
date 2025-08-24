const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const Level = require('../../Schemas/levelSchema');
const actualizarLevelRoles = require('../../utils/actualizarLevelRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnivel')
    .setDescription('Asigna un nivel directamente a un usuario (1-80)')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario al que quieres asignar el nivel')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('nivel')
        .setDescription('Nivel a asignar (1-80)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(80)),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.headStaffRoleId)) {
      return interaction.reply({ content: '⛔ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const nivel = interaction.options.getInteger('nivel');

    try {
      await Level.findOneAndUpdate(
        { userId: user.id },
        { level: nivel },
        { upsert: true, new: true }
      );

      const member = await interaction.guild.members.fetch(user.id);
      await actualizarLevelRoles(member, nivel);

      await interaction.reply({ content: `✅ Nivel ${nivel} asignado a ${user.tag} y roles actualizados.` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Hubo un error al asignar el nivel.', ephemeral: true });
    }
  },
};
