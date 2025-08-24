const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Elimina una cantidad de mensajes de 1-99.")
        .addIntegerOption((option) =>
            option
                .setName("cantidad")
                .setDescription("Cantidad de mensajes a eliminar.")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99)
        )
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("Usuario del cual quieres eliminar mensajes.")
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const cantidad = interaction.options.getInteger("cantidad");
        const user = interaction.options.getUser("usuario");

        const mensajes = await interaction.channel.messages.fetch({ limit: 100 });

        console.log(`Cantidad de mensajes obtenidos: ${mensajes.size}`);
        if (user) {
            let i = 0;
            let mensajeseliminar = [];

            mensajes.filter((message) => {
                if (message.author.id === user.id && i < cantidad) {
                    mensajeseliminar.push(message);
                    i++;
                }
            });

            console.log(`Mensajes encontrados para ${user.tag}: ${mensajeseliminar.length}`);
            if (mensajeseliminar.length === 0) {
                return interaction.reply({
                    content: `**❌ERROR❌** No se encontraron mensajes de **${user.tag}** para eliminar.`,
                    ephemeral: true,
                });
            }

            await interaction.channel.bulkDelete(mensajeseliminar, true).then((mensaje) => {
                console.log(`Mensajes eliminados: ${mensaje.size}`);
                const embed = new EmbedBuilder()
                    .setTitle("🧹 Mensajes Eliminados")
                    .setDescription(`Se han eliminado **${mensaje.size}** mensaje(s) de **${user.tag}** correctamente.`)
                    .setColor(0x00FF00) 
                    .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                interaction.reply({ embeds: [embed], ephemeral: true }).then((sentMessage) => {
                    setTimeout(() => sentMessage.delete(), 1000);
                });
            }).catch((error) => {
                console.error("Error al eliminar los mensajes:", error);
                interaction.reply({
                    content: "Hubo un error al intentar eliminar los mensajes.",
                    ephemeral: true,
                });
            });
        } else {
            console.log(`Eliminando ${cantidad} mensajes generales`);
            await interaction.channel.bulkDelete(cantidad, true).then((mensaje) => {
                console.log(`Mensajes eliminados: ${mensaje.size}`);
                const embed = new EmbedBuilder()
                    .setTitle("🧹 Mensajes Eliminados")
                    .setDescription(`Se han eliminado **${mensaje.size}** mensaje(s) correctamente.`)
                    .setColor(0x00FF00) 
                    .setFooter({ text: `Bot de moderación automático | Clear` })
                    .addFields(
                        { name: `**🗑️Mensajes eliminados**`, value: `${mensaje.size}`, inline: true },
                        { name: `**🛡️Moderador responsable**`, value: `${interaction.user}`, inline: true },
                        { name: `**📆Fecha**`, value: `${new Date().toLocaleString('es-ES')}`, }
                    );

                interaction.reply({ embeds: [embed], ephemeral: false }).then((sentMessage) => {
                    setTimeout(() => sentMessage.delete(), 1000);
                });
            }).catch((error) => {
                console.error("Error al eliminar los mensajes:", error);
                interaction.reply({
                    content: "Hubo un error al intentar eliminar los mensajes.",
                    ephemeral: true,
                });
            });
        }
    },
};
