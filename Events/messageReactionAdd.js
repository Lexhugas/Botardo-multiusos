const Sugerencia = require('../Schemas/sugerenciaSchema.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    if (user.bot) return;
    const { message } = reaction;

    const sugerencia = await Sugerencia.findOne({ messageId: message.id });
    if (!sugerencia) return;

    if (reaction.emoji.name === '👍') sugerencia.upvotes++;
    else if (reaction.emoji.name === '👎') sugerencia.downvotes++;
    else return;

    let nuevoEstado = sugerencia.state;
    if (sugerencia.upvotes - sugerencia.downvotes >= 15) nuevoEstado = 'aceptada';
    else if (sugerencia.downvotes - sugerencia.upvotes >= 15) nuevoEstado = 'rechazada';

    if (nuevoEstado !== sugerencia.state) {
      sugerencia.state = nuevoEstado;

      const color = nuevoEstado === 'aceptada' ? 'Green' : 'Red';
      const estadoTexto = nuevoEstado === 'aceptada' ? '🟢 Aceptada' : '🔴 Rechazada';

      const nuevoEmbed = EmbedBuilder.from(message.embeds[0])
        .setColor(color)
        .setDescription(
          `💡 **Sugerencia:**\n> ${sugerencia.suggestion}\n\n📊 **Votos a favor:** ${sugerencia.upvotes}\n📉 **Votos en contra:** ${sugerencia.downvotes}\n📌 **Estado:** ${estadoTexto}`
        );

      await message.edit({ embeds: [nuevoEmbed] });
    }

    await sugerencia.save();
  }
};
