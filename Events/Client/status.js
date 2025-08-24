const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const config = require("../../config.json")

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`Conectado como ${client.user.tag}`);


    const actualizarEstado = () => {
        const servidores = client.guilds.cache.size;
        client.user.setPresence({
            activities: [{
                name: `${servidores} Servidores`,
                type: ActivityType.Watching  
            }],
            status: 'online'
        });
    };

    actualizarEstado(); 
    setInterval(actualizarEstado, 60000); 
});
