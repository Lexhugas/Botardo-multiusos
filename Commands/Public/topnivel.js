const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Level = require('../../Schemas/levelSchema');

module.exports = {
  data: new SlashCommandBuilder().setName('topnivel').setDescription('Top 10 niveles'),
  async execute(interaction) {
    const top = await Level.find()
      .sort({ level: -1, xp: -1 })
      .limit(10)
      .exec();

    const valor = await Promise.all(top.map(async (u, i) => {
      const member = await interaction.guild.members.fetch(u.userId).catch(() => null);
      const name = member ? member.user.username : 'Desconocido';
      return `#${i+1} **${name}** — Nivel ${u.level} (${u.xp} XP)`;
    }));

    const embed = new EmbedBuilder()
      .setTitle('🎯 Top 10 Niveles')
      .setDescription(valor.join('\n'))
      .setColor('Blue');

    interaction.reply({ embeds: [embed] });
  }
};
