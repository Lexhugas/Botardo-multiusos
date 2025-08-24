const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { calculate } = require('../../utils/calculadora');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcular')
        .setDescription('Realiza una operación matemática y muestra detalles.')
        .addStringOption(option =>
            option.setName('expresión')
                .setDescription('La expresión matemática a calcular')
                .setRequired(true)
        ),

    async execute(interaction) {
        const expression = interaction.options.getString('expresión');
        let result;
        let errorMessage = "";

        try {
            result = calculate(expression);
        } catch (error) {
            errorMessage = "Error: La expresión matemática es inválida.";
        }

        let operationType = "Desconocida";
        if (expression.includes('+')) operationType = "Suma";
        if (expression.includes('-')) operationType = "Resta";
        if (expression.includes('*') || expression.includes('x')) operationType = "Multiplicación";
        if (expression.includes('/')) operationType = "División";
        if (expression.includes('√')) operationType = "Raíz cuadrada";

        let divisionDetails = "";
        if (operationType === "División") {
            const [dividend, divisor] = expression.split('/').map(Number);
            const quotient = Math.floor(dividend / divisor);
            const remainder = dividend % divisor;

            divisionDetails = `📗Cociente: ${quotient}, \n📘Resto: ${remainder}`;
            if (remainder === 0) {
                divisionDetails += "\n\n✅Es una división exacta.";
            } else {
                divisionDetails += "\n\n✅Es una división entera.";
            }
        }

        const embed = new EmbedBuilder()
            .setTitle("Sistema de Calculadora 📐")
            .setDescription(errorMessage || "La operación matemática se ha calculado con éxito.")
            .setColor(0x00FF00)  

            .addFields(
                { name: "⚙️Tipo de Operación:", value: String(operationType), inline: true },
                { name: "📏Enunciado de Operación:", value: String(expression), inline: false },
                { name: "📝Solución Final:", value: String(result !== undefined ? result : errorMessage), inline: false }
            );

        if (operationType === "División") {
            embed.addFields(
                { name: "📊Detalles de la División:", value: String(divisionDetails), inline: false }
            );
        }

        embed.setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
