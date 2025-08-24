const { Client, GatewayIntentBits, Partials, Collection, Events, EmbedBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildInvites } = GatewayIntentBits; 
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildInvites], 
    partials: [User, Message, GuildMember, ThreadMember]
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const afkSchema = require('./Schemas/afkSchema');
const MessagesCount = require('./Schemas/MessagesCount');
const config = require("./config.json");

const { addPoints } = require('./utils'); 

client.config = config;
client.events = new Collection();
client.commands = new Collection();
client.utils = new Collection();
client.buttons = new Collection();

client.invitesCache = new Map(); 


loadCommands(client);
loadEvents(client);
loadButtons(client);


client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.guilds.cache.forEach(async guild => {
        try {
            const invites = await guild.invites.fetch();
            client.invitesCache.set(guild.id, invites);
        } catch (e) {
            console.error(`No pude cargar invites del servidor ${guild.id}:`, e);
        }
    });
});


client.on(Events.GuildMemberAdd, async member => {
    try {
        const cachedInvites = client.invitesCache.get(member.guild.id) || new Map();
        const newInvites = await member.guild.invites.fetch();
        client.invitesCache.set(member.guild.id, newInvites);

        const usedInvite = newInvites.find(inv => {
            const oldUses = cachedInvites.get(inv.code)?.uses || 0;
            return inv.uses > oldUses;
        });

        if (usedInvite) {
            const inviterId = usedInvite.inviter?.id;
            if (inviterId && inviterId !== member.id) {
                await addPoints(member.guild.id, inviterId, 3); // +3 puntos/inv
                console.log(`Se sumaron 3 puntos a ${inviterId} por invitar a ${member.user.tag}`);
            }
        }
    } catch (e) {
        console.error('Error manejando invitaciones para puntos:', e);
    }
});


client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    await MessagesCount.findOneAndUpdate(
        { guildId: message.guild.id, userId: message.author.id },
        { $inc: { count: 1 }, $set: { username: message.author.tag } },
        { upsert: true }
    );
});


client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const check = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id });
    if (check) {
        const nick = check.Nickname;
        const msg = check.Message || 'No especificado';
        const afkTimestamp = check.Timestamp;
        const afkTime = Math.floor((Date.now() - afkTimestamp) / 60000);

        await afkSchema.deleteMany({ Guild: message.guild.id, User: message.author.id });

        await message.member.setNickname(`${nick}`).catch(() => {});

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle('🏷️ **Bienvenido de nuevo**')
            .setDescription(`**${message.author.tag}** ha regresado tras un tiempo inactivo.`)
            .addFields(
                { name: "👤 Usuario Afk:", value: `${message.author.tag}`, inline: true },
                { name: "⏰ Tiempo Afk:", value: `${afkTime} minutos`, inline: true },
                { name: "📝 Motivo del Afk:", value: `${msg}`, inline: false }
            )
            .setFooter({ text: 'Estado AFK desactivado' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    } else {
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) return;

        const Data = await afkSchema.findOne({ Guild: message.guild.id, User: mentionedUser.id });
        if (!Data) return;

        const member = message.guild.members.cache.get(mentionedUser.id);
        const msg = Data.Message || 'Ninguna razón dada';
        const afkTimestamp = Data.Timestamp;
        const afkTime = Math.floor((Date.now() - afkTimestamp) / 60000);

        if (message.content.includes(mentionedUser.id)) {
            const embedAFK = new EmbedBuilder()
                .setColor('#FF6347')
                .setTitle('🚨 **Usuario AFK**')
                .setDescription(`⏳ **${member.user.tag}** se encuentra AFK en estos momentos.`)
                .addFields(
                    { name: "👤 Usuario Afk:", value: `${member.user.tag}`, inline: true },
                    { name: "⏰ Tiempo Afk:", value: `${afkTime} minutos`, inline: true },
                    { name: "📝 Motivo del Afk:", value: `${msg}`, inline: false }
                )
                .setFooter({ text: 'El usuario puede tardar en responder.' })
                .setTimestamp();

            const m = await message.reply({ embeds: [embedAFK] });
            setTimeout(() => m.delete(), 4000);
        }
    }
});

client.login(config.token);
