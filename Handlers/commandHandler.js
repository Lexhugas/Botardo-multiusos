async function loadCommands(client) {
    const { loadFiles } = require("../Functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Commands", "Status");

    await client.commands.clear();

    let commandsArray = [];

    const Files = await loadFiles("Commands");

    Files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        table.addRow(command.data.name, "🟩");
    });

    client.once('ready', async () => {
        try {
            await client.application.commands.set(commandsArray);
            console.log(table.toString(), "\nCommands Loaded.");
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    });
}

module.exports = { loadCommands };
