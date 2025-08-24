const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const quotes = [
  { text: "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir adelante.", author: "Albert Einstein" },
  { text: "Si puedes soñarlo, puedes hacerlo.", author: "Walt Disney" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { text: "Todo lo que siempre has querido está al otro lado del miedo.", author: "George Addair" },
  { text: "A veces pierdes, otras veces aprendes.", author: "Nelson Mandela" },
  { text: "No soy perezoso. Estoy en modo ahorro de energía.", author: "🤖 Internet" },
  { text: "¡Trabaja duro en silencio y deja que tu éxito haga el ruido!", author: "💼 Anónimo" },
  { text: "¡La motivación es lo que te hace empezar, el hábito es lo que te mantiene!", author: "Jim Ryun" },
  { text: "Yo no procrastino. Solo doy vueltas estratégicas al destino.", author: "🐢 Usuario random" },
  { text: "No dejes para mañana lo que puedas evitar para siempre.", author: "😴 Clásico vago" }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('📜 Recibe una cita inspiradora, graciosa o reflexiva'),

  async execute(interaction) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
      .setColor('#00BFFF')
      .setTitle('📜 Cita del día')
      .setDescription(`*"${randomQuote.text}"*\n\n— **${randomQuote.author}**`)
      .setFooter({ text: '💡 Inspírate, ríe o reflexiona' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
