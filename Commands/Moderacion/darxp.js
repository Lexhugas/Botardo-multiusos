const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Level = require('../../Schemas/levelSchema');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('darxp')
    .setDescription('Dar experiencia a un usuario (solo Head Staff)')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario al que dar experiencia')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de experiencia (máximo 350)')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const staff = interaction.member;
    const target = interaction.options.getUser('usuario');
    const cantidad = interaction.options.getInteger('cantidad');

    if (!staff.roles.cache.has(config.headStaffRoleId)) {
      return interaction.reply({
        content: '❌ No tienes permiso para usar este comando.',
        ephemeral: true
      });
    }

    if (cantidad > 350 || cantidad <= 0) {
      return interaction.reply({
        content: '⚠️ La cantidad debe ser entre 1 y 350.',
        ephemeral: true
      });
    }

    const lvl = await Level.findOneAndUpdate(
      { userId: target.id },
      { $inc: { xp: cantidad } },
      { upsert: true, new: true }
    );

    await interaction.reply({
      content: `✅ Has otorgado **${cantidad} XP** a ${target.tag}. Ahora tiene ${lvl.xp} XP.`,
      ephemeral: true
    });
  }
};
