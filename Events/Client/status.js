const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const config = require("../../config.json")

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`Conectado como ${client.user.tag}`);

    // Función para actualizar el estado
    const actualizarEstado = () => {
        const servidores = client.guilds.cache.size;
        client.user.setPresence({
            activities: [{
                name: `${servidores} Servidores`,
                type: ActivityType.Watching  // Puedes probar también Competing o Listening
            }],
            status: 'online'
        });
    };

    actualizarEstado(); // Llamar al iniciar
    setInterval(actualizarEstado, 60000); // Actualizar cada 60 segundos
});
