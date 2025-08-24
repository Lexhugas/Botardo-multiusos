const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Level = require('../../Schemas/levelSchema');

module.exports = {
  data: new SlashCommandBuilder().setName('nivel').setDescription('Muestra tu nivel'),
  async execute(interaction) {
    const usuario = interaction.user;
    const lvl = await Level.findOne({ userId: usuario.id }) || { xp: 0, level: 0 };
    const needed = 1000 + lvl.level * 400;
    const perc = Math.min((lvl.xp / needed) * 100, 100);
    const barras = Math.round(perc / 10);
    const barra = '█'.repeat(barras) + '░'.repeat(10 - barras);

    const ranking = await Level.find().sort({ level: -1, xp: -1 }).exec();
    const pos = ranking.findIndex(u => u.userId === usuario.id) + 1 || 'N/A';

    const embed = new EmbedBuilder()
      .setTitle(`🎖️ Nivel de ${usuario.username}`)
      .setDescription('Esta es tu información de nivel. ¡Sigue siendo activo para conseguir más XP y ganarte recompensas!')
      .addFields(
        { name: '🏅 Nivel actual', value: `\`${lvl.level}\``, inline: true },
        { name: '🧪 XP restante', value: `\`${lvl.xp}/${needed}\``, inline: true },
        { name: '🏆 Ranking', value: `Posición #${pos}`, inline: true },
        { name: '📈 Progreso', value: barra, inline: true},
      )
      .setColor('Blue')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setImage('https://www.versum.com/m/es/wp-content/uploads/sites/6/2019/09/stat.jpg')
      .setTimestamp()
      .setFooter({ text: 'Sistema de Niveles' });

    interaction.reply({ embeds: [embed] });
  }
};
