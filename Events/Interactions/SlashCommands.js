const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
        return interaction.reply({
            content: "This command is outdated.",
            ephermal: true,
        });

        if (command.developer && interaction.user.id !== "953747971932049449")
        return interaction.reply({
            content: "Este commando es solo para el developer.",
            ephermal: true,
        });

        command.execute(interaction, client);
    },
};