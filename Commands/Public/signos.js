const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('signos')
        .setDescription('Manda un menú con los signos matemáticos para tu operación.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("📚 Menú de Signos Matemáticos")
            .setDescription("Aquí tienes una guía de los signos matemáticos que puedes usar en tus operaciones.")
            .setColor(0x0000FF)  
            .addFields(
                { name: "➕ Suma", value: "El signo usado es: `+`", inline: true },
                { name: "➖ Resta", value: "El signo usado es: `-`", inline: true },
                { name: "✖️ Multiplicación", value: "El signo usado es: `*` o `x`", inline: true },
                { name: "➗ División", value: "El signo usado es: `/`", inline: true },
                { name: "✔️ Raíz Cuadrada", value: "El signo usado es: `√`", inline: true },
                { name: "🟰 Potencia", value: "El signo usado es: `^`", inline: true },
                { name: "☑️ Porcentaje", value: "El signo usado es: `%`", inline: true }
            )
            .setFooter({ text: "El uso de otros signos resultará en error Matemático ⚠️" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
