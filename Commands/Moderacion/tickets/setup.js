const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ticket')
    .setDescription('Configura el panel de tickets'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2') 
      .setTitle('🎫 Panel de Tickets')
      .setDescription(
         '¡Bienvenido al sistema de soporte! Aquí puedes crear un ticket para obtener ayuda personalizada.\n\n' +
         'Selecciona el tipo de ticket que deseas abrir y un miembro de nuestro equipo te asistirá pronto.'
      )
      .addFields(
         {
          name: '📌 Información Adicional',
          value:
            '**Reportes:** Reporta a un usuario por comportamientos que quebrantan las normas.\n' +
            '**Bugs:** Notifica al Staff sobre un bug encontrado en cualquier plataforma.\n' +
            '**Soporte General:** Consulta dudas acerca de la normativa y/o funcionamiento del server.',
    },
    {
      name: '📜 Normas para usar los Tickets',
      value:
        '• Usa un lenguaje respetuoso y claro.\n' +
        '• No abuses del sistema de tickets con solicitudes innecesarias.\n' +
        '• Proporciona toda la información necesaria para ayudarte.\n' +
        '• Evita compartir información sensible en los tickets.\n' +
        '• Sé paciente, el staff responderá lo antes posible.',
    }
    )
     .setFooter({ text: 'Gracias por confiar en nuestro soporte.' })
     .setTimestamp();


    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_bugs')
        .setLabel('🔩 Bugs')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ticket_reporte')
        .setLabel('📣 Reporte')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ticket_soporte')
        .setLabel('⚠️ Soporte general')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
