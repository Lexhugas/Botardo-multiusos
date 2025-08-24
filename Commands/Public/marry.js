const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');
const Marriage = require('../../Schemas/marriageSchema');
const { createEmbed } = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('marry')
    .setDescription('Proponer matrimonio a otro usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a proponer').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('usuario');
    const proposer = interaction.user;

    if (target.id === proposer.id) return interaction.reply({ content: 'No puedes casarte contigo mismo.', ephemeral: true });
    if (target.bot) return interaction.reply({ content: 'No puedes casarte con un bot.', ephemeral: true });

    const existing = await Marriage.findOne({ $or: [
      { user1: proposer.id }, 
      { user2: proposer.id }, 
      { user1: target.id }, 
      { user2: target.id }
    ]});

    if (existing) return interaction.reply({ content: 'Alguno ya está casado con alguien.', ephemeral: true });

    const embed = createEmbed({
      title: '💍 Propuesta de matrimonio',
      description: `${target}, Aceptas ser la pareja de ${proposer}.\nEn la salud y en la enfermedad, prometeré cuidarte hasta el fin de los días.\n¿Aceptas?`,
    }).setThumbnail(target.displayAvatarURL({ extension: 'png' }));

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('marry_yes').setLabel('Aceptar').setStyle(ButtonStyle.Success).setEmoji('💍'),
        new ButtonBuilder().setCustomId('marry_no').setLabel('Rechazar').setStyle(ButtonStyle.Danger)
      );

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = i => ['marry_yes', 'marry_no'].includes(i.customId) && i.user.id === target.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      collector.stop();

      if (i.customId === 'marry_yes') {
        const db = new Marriage({ user1: proposer.id, user2: target.id });
        await db.save();

        const coupleEmbed = createEmbed({
          title: '🎊 ¡Nos hemos casado!',
          description: `@everyone\n\n${proposer} ❤️ ${target}\n¡Felicitaciones a la nueva pareja!\nEstáis invitados a nuestra fiesta!\nEl Domingo a las 7:30pm en la\nCalle de las Flores.`
        });

        const role = interaction.guild.roles.cache.get(config.casadosRoleId);
        const m1 = await interaction.guild.members.fetch(proposer.id);
        const m2 = await interaction.guild.members.fetch(target.id);

        await m1.roles.add(role);
        await m2.roles.add(role);
        await m1.setNickname(`${m1.nickname || m1.user.username} <3`).catch(() => {});
        await m2.setNickname(`${m2.nickname || m2.user.username} <3`).catch(() => {});

        await i.update({ embeds: [coupleEmbed], components: [] });
      } else {
        const deny = createEmbed({
          title: '❌ Propuesta rechazada',
          description: `${target} ha rechazado la propuesta de ${proposer}. \nHoy va a ser un día triste para ${proposer}`,
          color: 0xFF0000
        });
        await i.update({ embeds: [deny], components: [] });
      }
    });

    setTimeout(async () => {
      try {
        await interaction.editReply({ content: "⏰ Tiempo agotado. Propuesta expiró.", components: [] });
      } catch (err) {
        console.warn("No se pudo editar el mensaje porque ya no existe.");
      }
    }, 60000);
  }
};
