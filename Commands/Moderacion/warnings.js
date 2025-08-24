const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Warn = require('../../Schemas/warnSchema'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Muestra las advertencias de un usuario.")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("Usuario para revisar las advertencias.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const usuario = interaction.options.getUser("usuario");

        console.log("Buscando advertencias para el usuario:", usuario.tag);

        try {
            const warnsUsuario = await Warn.find({ usuarioAdvertido: usuario.tag });

            if (warnsUsuario.length === 0) {
                const embedSinAvisos = new EmbedBuilder()
                    .setTitle("🛠️ Ninguna advertencia")
                    .setDescription(`📝No se encontraron avisos para el usuario **${usuario.tag}**.`)
                    .setColor("Blue")
                    .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: `Sistema de Moderación • ${new Date().toLocaleString("es-ES")}` });

                return interaction.reply({ embeds: [embedSinAvisos] });
            }

            const totalWarns = warnsUsuario.lenght;
            let accionTomada = "✨ El usuario no tiene acciones."

            if (totalWarns >= 12) {
                accionTomada = "⛔ Usuario Baneado"
            } else if (totalWarns >= 8) {
                accionTomada = "📌 Usuario Kickeado"
            }

            const embedAvisos = new EmbedBuilder()
                .setTitle(`📋 Lista de advertencias ${usuario.tag}`)
                .setColor("Blue")
                .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Sistema de Moderación • ${new Date().toLocaleString("es-ES")}` });

            warnsUsuario.reverse().forEach((warn, index) => {
                embedAvisos.addFields({
                    name: `📋 Aviso #${index + 1}`,
                    value: `> **Motivo:** ${warn.motivo}\n> **Advertido por:** ${warn.moderador}\n> **Fecha:** ${warn.fecha}\n> **Reclamable:** ${warn.apelable}`,
                });
                embedAvisos.addFields({ name: '\u200B', value: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬', inline: false });
            });

            embedAvisos.addFields(
                { name: "📊 Advertencias del usuario", value: `${warnsUsuario.length}`, inline: true },
                { name: "⚠️ Última advertencia", value: warnsUsuario[0].motivo, inline: false },
                { name: "⚖️ ¿Se aplicaron acciones?", value: `${accionTomada}`}
            );

            interaction.reply({ embeds: [embedAvisos] });

        } catch (error) {
            console.error("Error al obtener las advertencias:", error);
            interaction.reply({ content: "❌ Hubo un error al obtener las advertencias.", ephemeral: true });
        }
    },
};
