const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  AttachmentBuilder
} = require('discord.js');

const config = require('../config.json');
const StaffPoints = require('../Schemas/staffPoints.js');
const Sugerencia = require('../Schemas/sugerenciaSchema.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.guild || interaction.user.bot) return;

    // ------------------- BOTONES -------------------
    if (interaction.isButton()) {
      if (
        interaction.customId === 'ticket_bugs' ||
        interaction.customId === 'ticket_reporte' ||
        interaction.customId === 'ticket_soporte'
      ) {
        const tipo = interaction.customId.split('_')[1];

        const modal = new ModalBuilder()
          .setCustomId(`ticketModal_${tipo}`)
          .setTitle(`Abrir ticket - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);

        const asuntoInput = new TextInputBuilder()
          .setCustomId('input0')
          .setLabel('¿Cuál es el asunto de tu ticket?')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const detalleInput = new TextInputBuilder()
          .setCustomId('input1')
          .setLabel('Describe con detalle tu problema o solicitud')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const firstRow = new ActionRowBuilder().addComponents(asuntoInput);
        const secondRow = new ActionRowBuilder().addComponents(detalleInput);

        modal.addComponents(firstRow, secondRow);

        return interaction.showModal(modal);
      }

      const botonesStaff = ['claim_ticket', 'alert_ticket', 'sugerencia_aceptar', 'sugerencia_rechazar'];
      if (botonesStaff.includes(interaction.customId)) {
        if (!interaction.member.roles.cache.has(config.staffRoleId)) {
          return interaction.reply({
            content: '❌ No tienes permisos para realizar esta acción.',
            ephemeral: true
          });
        }
      }

      if (interaction.customId === 'claim_ticket') {
        const staff = await StaffPoints.findOne({ userId: interaction.user.id }) || new StaffPoints({ userId: interaction.user.id });
        staff.puntos += 1;
        await staff.save();

        const channel = interaction.channel;
        await channel.permissionOverwrites.edit(config.staffRoleId, { ViewChannel: false });
        await channel.permissionOverwrites.edit(interaction.user.id, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        });

        const embed = new EmbedBuilder()
          .setTitle('🎟️ Ticket reclamado')
          .setDescription(`El ticket ha sido reclamado por el Staff **${interaction.user.tag}**.\n\nÉl atenderá su duda.`)
          .setColor('#0099ff')
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: false });
      }

      if (interaction.customId === 'alert_ticket') {
        const userId = interaction.message.mentions.users.first()?.id;
        if (!userId) return interaction.reply({ content: '❌ No encuentro quién creó el ticket.', ephemeral: true });

        await interaction.channel.send({
          content: `<@${userId}>, por favor responde al ticket.`,
          embeds: [
            new EmbedBuilder()
              .setTitle('📣 Alerta')
              .setColor('Yellow')
              .setDescription('Se solicita tu respuesta al ticket.')
          ]
        });
        return interaction.reply({ content: '🔔 Alerta enviada.', ephemeral: true });
      }

      if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        const userId = channel.topic;
        const user = await interaction.guild.members.fetch(userId).catch(() => null);

        await interaction.reply({ content: '🔒 Cerrando ticket, generando transcript...', ephemeral: true });

        const messages = await channel.messages.fetch({ limit: 100 });
        const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        let transcriptText = '';
        sortedMessages.forEach(msg => {
          const timestamp = new Date(msg.createdTimestamp).toLocaleString('en-US');
          const author = msg.member?.nickname || msg.author.username;
          const content = msg.content || '';
          transcriptText += `${timestamp} - ${author}: ${content}\n`;
        });

        const transcriptBuffer = Buffer.from(transcriptText, 'utf-8');
        const file = new AttachmentBuilder(transcriptBuffer, { name: `transcript-${channel.name}.txt` });

        const claimedBy = channel.permissionOverwrites.cache.find(po =>
          po.type === 1 && po.allow.has('ViewChannel')
        )?.id;

        const embed = new EmbedBuilder()
          .setTitle('🎫 Ticket Cerrado')
          .addFields(
            { name: '👤 Usuario', value: user ? `<@${user.id}>` : 'Desconocido', inline: true },
            { name: '🛡️ Cerrado por', value: `<@${interaction.user.id}>`, inline: true },
            { name: '📂 Categoría', value: channel.parent?.name || 'N/A', inline: true },
            { name: '💬 Mensajes', value: `${messages.size}`, inline: true }
          )
          .setColor('Red')
          .setTimestamp();

        const transcriptChannel = interaction.guild.channels.cache.get(config.transcriptChannelId);
        if (transcriptChannel) {
          await transcriptChannel.send({
            embeds: [embed],
            files: [file]
          });
        }

        if (user) {
          try {
            const embedDM = new EmbedBuilder()
              .setTitle('🎫 Ticket Cerrado')
              .setDescription(
                '**Ticket Cerrado**\n' +
                `> Tu ticket ha sido cerrado en **Covecraft**\n` +
                '> ¡Nos gustaría saber tu valoración!. Por favor, evalúa el nivel de soporte con 1-5 estrellas en el canal de valoraciones.\n\n' +
                '**• Información del Ticket**\n' +
                `> Categoría: ${channel.parent?.name || 'N/A'}\n` +
                `> Reclamado: ${claimedBy ? `<@${claimedBy}>` : 'No Reclamado'}\n` +
                `> Total de Mensajes: ${messages.size}`
              )
              .setColor('Blue')
              .setTimestamp();

            await user.send({ embeds: [embedDM], files: [file] });
          } catch {
            console.warn(`❌ No se pudo enviar el DM a ${user?.user?.tag || user?.displayName}`);
          }
        }

        return;
      }

      if (interaction.customId === 'sugerencia_aceptar' || interaction.customId === 'sugerencia_rechazar') {
        try {
          const mensaje = await interaction.channel.messages.fetch(interaction.message.id);
          const sugerencia = await Sugerencia.findOne({ messageId: interaction.message.id });
          if (!sugerencia) {
            return interaction.reply({
              content: '❌ No se encontró la sugerencia en la base de datos.',
              ephemeral: true
            });
          }

          sugerencia.state = interaction.customId === 'sugerencia_aceptar' ? 'aceptada' : 'rechazada';

          const color = sugerencia.state === 'aceptada' ? 'Green' : 'Red';
          const estadoTexto = sugerencia.state === 'aceptada' ? '🟢 Aceptada' : '🔴 Rechazada';

          const embedEditado = EmbedBuilder.from(mensaje.embeds[0])
            .setColor(color)
            .setDescription(
              `💡 **Sugerencia:**\n> ${sugerencia.suggestion}\n\n📊 **Votos a favor:** ${sugerencia.upvotes}\n📉 **Votos en contra:** ${sugerencia.downvotes}\n📌 **Estado:** ${estadoTexto}`
            );

          await interaction.update({ embeds: [embedEditado] });
          await sugerencia.save();
        } catch (error) {
          console.error('❌ Error al procesar botón de sugerencia:', error);
          return interaction.reply({
            content: '❌ Hubo un error al actualizar la sugerencia.',
            ephemeral: true
          });
        }
      }
    }

    // ------------------- MODALES -------------------
    if (
      interaction.type === InteractionType.ModalSubmit &&
      interaction.customId.startsWith('ticketModal_')
    ) {
      const tipo = interaction.customId.split('_')[1];
      const asunto = interaction.fields.getTextInputValue('input0');
      const detalle = interaction.fields.getTextInputValue('input1');

      const categoryId = config.ticketCategories[tipo];
      if (!categoryId) {
        return interaction.reply({ content: `⚠️ Categoría "${tipo}" no configurada.`, ephemeral: true });
      }

      const canal = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: categoryId,
        topic: interaction.user.id,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          },
          {
            id: config.staffRoleId,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎫 Ticket - ${tipo}`)
        .setDescription(`Hola <@${interaction.user.id}>, un miembro del staff te atenderá pronto.`)
        .addFields(
          { name: '👤 Usuario', value: `<@${interaction.user.id}>`, inline: true },
          { name: '📌 Asunto', value: asunto, inline: true },
          { name: '📝 Detalle', value: detalle }
        )
        .setColor('Blue')
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('claim_ticket').setLabel('🛡️ Reclamar').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('alert_ticket').setLabel('📣 Alerta').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Cerrar').setStyle(ButtonStyle.Danger)
      );

      await canal.send({
        embeds: [embed],
        components: [row],
        content: `<@&${config.staffRoleId}> <@${interaction.user.id}>`
      });

      return interaction.reply({ content: `✅ Ticket creado: <#${canal.id}>`, ephemeral: true });
    }
  }
};
