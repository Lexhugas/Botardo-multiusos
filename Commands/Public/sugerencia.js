
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SugerenciaSchema = require('../../Schemas/sugerenciaSchema'); 
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sugerencia')
    .setDescription('Envía una sugerencia al equipo')
    .addStringOption(option =>
      option.setName('contenido')
        .setDescription('Contenido de la sugerencia')
        .setRequired(true)
    ),

  async execute(interaction) {
    const contenido = interaction.options.getString('contenido');
    const canalId = config.sugerenciasChannelId; 
    const canal = interaction.guild.channels.cache.get(canalId);

    if (!canal) return interaction.reply({ content: '❌ No se encontró el canal de sugerencias.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('📬 NUEVA SUGERENCIA')
      .setDescription(`Si quieres enviar la tuya, usa **/sugerencia <sugerencia>**\nRecuerda usar un lenguaje **Claro y Conciso** Y respetar todas las sugerencias!\n\n💡 **Sugerencia enviada por:** <@${interaction.user.id}>

📄 **Contenido:**
${contenido}

📊 **Estado:** 🟠 Pendiente`,)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setColor('Orange')
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('sugerencia_aceptar')
        .setLabel('✅ Aceptar')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('sugerencia_rechazar')
        .setLabel('❌ Rechazar')
        .setStyle(ButtonStyle.Danger)
    );

    const mensaje = await canal.send({ embeds: [embed], components: [row] });

    await mensaje.react('👍');
    await mensaje.react('👎');


    await SugerenciaSchema.create({
  	  messageId: mensaje.id,
      userId: interaction.user.id,
      suggestion: contenido,  
      guildId: interaction.guildId,  
      state: 'pendiente',  
      upvotes: 0,  
      downvotes: 0  
    });


    await interaction.reply({ content: '✅ Tu sugerencia fue enviada correctamente.', ephemeral: true });
  }
};
