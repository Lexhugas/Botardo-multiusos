const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('🎱 Hazle una pregunta a la bola mágica')
    .addStringOption(option =>
      option.setName('pregunta')
        .setDescription('Tu pregunta misteriosa')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pregunta = interaction.options.getString('pregunta');

    const positivas = [
      '✅ ¡Sí, y prepárate para lo épico!',
      '🌈 Claro que sí, campeón.',
      '🔮 Las estrellas se alinearon a tu favor.',
      '🎉 Absolutamente, y con estilo.',
      '🔥 ¡Sí! Pero cuidado con las consecuencias...',
      '🕺 Sí, y deberías celebrarlo bailando.',
      '🧠 ¡Obviamente! Incluso un simio lo sabría.',
      '💪 Sí, y te harás famoso por ello.',
      '🍀 ¡Tienes más suerte que un trébol mutante!',
      '🚀 ¡Sí! Y es tu momento de brillar.'
    ];

    const negativas = [
      '❌ Nope, ni en tus sueños más locos.',
      '🙃 No, pero al menos lo intentaste.',
      '💀 El lilbro se penso que si.',
      '😬 No cuentes con eso ni en otra dimensión.',
      '🥴 Nah, mejor ni preguntes.',
      '🚫 No, y fue una pregunta rara, la verdad.',
      '🤡 No, y eso fue muy payasesco.',
      '📉 Nope, eso va en picada.',
      '🪦 No, entierra esa idea ya.',
      '😑 Nop... siguiente pregunta, por favor.'
    ];

    const todas = [...positivas, ...negativas];
    const respuesta = todas[Math.floor(Math.random() * todas.length)];

    const embed = new EmbedBuilder()
      .setColor('#8A2BE2')
      .setTitle('🔮 8BALL MÁGICA')
      .setThumbnail('https://img.freepik.com/vector-premium/bola-magica_727501-105.jpg?w=740')
      .setDescription(`> 🗣️ **Pregunta:**\n\`${pregunta}\`\n\n> 🎱 **Respuesta mágica:**\n**${respuesta}**`)
      .setFooter({ text: 'La bola ha hablado... por ahora.', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
