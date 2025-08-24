const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const StaffPoints = require('../../Schemas/staffPoints');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('puntuacion')
    .setDescription('Muestra el top 10 de Staffs con más puntos.'),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const topStaff = await StaffPoints.find({ guildId: interaction.guild.id })
        .sort({ points: -1 })
        .limit(10);

      if (!topStaff.length) {
        return interaction.editReply({ content: 'No hay puntuaciones registradas.' });
      }

      const descripcion = topStaff
        .map((s, i) => `**${i + 1}.** <@${s.userId}> - **${s.points} puntos**`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏆 Top 10 Staff')
        .setDescription(descripcion)
        .setFooter({ text: 'Sistema de puntuaciones' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error en /puntuacion:', error);
      if (!interaction.replied && interaction.deferred) {
        await interaction.editReply({ content: '❌ Hubo un error al mostrar las puntuaciones.' }).catch(() => {});
      }
    }
  },
};
