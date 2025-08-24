const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Warn = require('../../Schemas/warnSchema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Elimina una advertencia de un usuario y le notifica.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario al que quieres eliminar la advertencia.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("id_advertencia")
                .setDescription("ID de la advertencia a eliminar.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const usuario = interaction.options.getUser("usuario");
        const idAdvertencia = interaction.options.getString("id_advertencia");
        const moderador = interaction.user;

        try {
            const warnToRemove = await Warn.findOne({ warnID: idAdvertencia, usuarioAdvertido: usuario.tag });

            if (!warnToRemove) {
                return interaction.reply({
                    content: "❌ No se encontró una advertencia con esa ID para este usuario.",
                    ephemeral: true
                });
            }

            const fechaEliminacion = new Date().toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            await Warn.deleteOne({ warnID: idAdvertencia, usuarioAdvertido: usuario.tag });

            const embedPrivado = new EmbedBuilder()
                .setTitle("✅ Sanción removida")
                .setDescription(`¡Hola **${usuario.tag}**!\n\nTu advertencia con el **ID ${idAdvertencia}** ha sido eliminada por **${moderador.tag}**.`)
                .setColor(0x00FF00) // Color verde
                .addFields(
                    { name: "🔍 ID de Advertencia", value: `\`${idAdvertencia}\``, inline: true },
                    { name: "📝 Motivo Original", value: warnToRemove.motivo, inline: true },
                    { name: "📅 Fecha de Eliminación", value: fechaEliminacion, inline: false }
                )
                .setFooter({ text: "🛡️ Sistema de Moderación" })
                .setTimestamp();

            try {
                await usuario.send({ embeds: [embedPrivado] });

                await interaction.reply({
                    content: `✅ Se eliminó correctamente la advertencia con **ID ${idAdvertencia}** del usuario **${usuario.tag}**.`,
                    ephemeral: true 
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: "❌ No se pudo enviar el mensaje privado al usuario. Es posible que tenga los MD cerrados.",
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error("Error al buscar o eliminar la advertencia:", error);
            interaction.reply({
                content: "❌ Hubo un problema al eliminar la advertencia.",
                ephemeral: true
            });
        }
    }
};
