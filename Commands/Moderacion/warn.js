const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Warn = require('../../Schemas/warnSchema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Advierte a un usuario con un motivo específico.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario a advertir.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("motivo")
                .setDescription("Escribe el motivo de la advertencia.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const usuario = interaction.options.getUser("usuario");
        const motivoFinal = interaction.options.getString("motivo");
        const moderador = interaction.user;
        const guild = interaction.guild;

        const warnCount = await Warn.countDocuments({ usuarioAdvertido: usuario.tag });

        const warnID = Math.floor(Math.random() * 1000000);

        let accionTomada = "🚫 Ninguna";

        if (warnCount + 1 === 8) {
            try {
                await guild.members.kick(usuario, `Expulsado por alcanzar 8 advertencias`);
                accionTomada = "❌ Expulsado del servidor";
            } catch (error) {
                console.error(`No se pudo expulsar a ${usuario.tag}:`, error);
                accionTomada = "⚠️ Error al intentar expulsar.";
            }
        } else if (warnCount + 1 === 12) {
            try {
                await guild.members.ban(usuario, { reason: `Baneado por alcanzar 12 advertencias` });
                accionTomada = "⛔ Baneado del servidor";
            } catch (error) {
                console.error(`No se pudo banear a ${usuario.tag}:`, error);
                accionTomada = "⚠️ Error al intentar banear.";
            }
        }

        let mensajeMD = "❌ **No**";
        try {
            const dmChannel = await usuario.createDM();
            const embedDM = new EmbedBuilder()
                .setTitle("⚠️ Has sido advertido")
                .setColor(0xFFFF00)
                .addFields(
                    { name: "👤 Usuario Advertido:", value: `${usuario.tag}`, inline: true },
                    { name: "🛡️ Moderador Responsable:", value: `${moderador.tag}`, inline: true },
                    { name: "📄 Motivo:", value: motivoFinal, inline: true },
                    { name: "📅 Fecha de advertencia:", value: new Date().toLocaleString("es-ES"), inline: true },
                    { name: "📊 Total de warns:", value: `${warnCount + 1}`, inline: true },
                    { name: "🔑 ID de la sanción:", value: `\`${warnID}\``, inline: true },
                    { name: "📬 Mensaje al MD:", value: "✅ **Sí**", inline: true },
                    { name: "⚖️ Acción tomada:", value: accionTomada, inline: true }
                )
                .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "🛡️ Sistema de Moderación" })
                .setTimestamp();

            await dmChannel.send({ embeds: [embedDM] });
            mensajeMD = "✅ **Sí**";
        } catch (error) {
            console.error("No se pudo enviar el mensaje al MD del usuario:", error);
        }

        const embedPublico = new EmbedBuilder()
            .setTitle("⚠️ Advertencia Aplicada")
            .setColor(0xFFFF00)
            .addFields(
                { name: "👤 Usuario Advertido:", value: `${usuario.tag}`, inline: true },
                { name: "🛡️ Moderador Responsable:", value: `${moderador.tag}`, inline: true },
                { name: "📄 Motivo:", value: motivoFinal, inline: true },
                { name: "📅 Fecha de advertencia:", value: new Date().toLocaleString("es-ES"), inline: true },
                { name: "📊 Total de warns:", value: `${warnCount + 1}`, inline: true },
                { name: "🔑 ID de la sanción:", value: `\`${warnID}\``, inline: true },
                { name: "📬 Mensaje al MD:", value: mensajeMD, inline: true },
                { name: "⚖️ Acción tomada:", value: accionTomada, inline: true }
            )
            .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: "🛡️ Sistema de Moderación" })
            .setTimestamp();

        const nuevoWarn = new Warn({
            moderador: moderador.tag,
            usuarioAdvertido: usuario.tag,
            motivo: motivoFinal,
            fecha: new Date().toLocaleString("es-ES"),
            warnID: warnID,
        });

        try {
            await nuevoWarn.save();
            await interaction.reply({ embeds: [embedPublico] });
            console.log("Warn guardado y mensaje enviado correctamente.");
        } catch (error) {
            console.error("Error al registrar el warn:", error);
            await interaction.followUp({ content: "❌ Hubo un error al registrar el warn.", ephemeral: true });
        }
    }
};

