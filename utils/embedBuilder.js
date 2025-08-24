const { EmbedBuilder } = require('discord.js');

function createEmbed({ title, description, color = 0xFF69B4, image }) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color);
  if (image) embed.setImage(image);
  return embed;
}

module.exports = { createEmbed };
