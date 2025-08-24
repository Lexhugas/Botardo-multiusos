const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Blacklist = require('../../Schemas/Blacklist.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('🔒 Blacklistea a un usuario con motivo.')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a blacklistear').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo del blacklist').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const guild = interaction.guild;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Usuario no encontrado en el servidor.', ephemeral: true });

    const role = guild.roles.cache.find(r => r.name.toLowerCase() === 'blacklist');
    if (!role) return interaction.reply({ content: '❌ Rol “Blacklist” no encontrado.', ephemeral: true });

    await member.roles.add(role).catch(() => {});

    await new Blacklist({
      userId: user.id,
      userTag: user.tag,
      staffId: interaction.user.id,
      staffName: interaction.member.displayName,
      reason
    }).save();

    let ch = guild.channels.cache.find(c => c.name === 'blacklist' && c.type === 0);
    if (!ch) {
      ch = await guild.channels.create({
        name: 'blacklist',
        type: 0,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: ['ViewChannel'] },
          { id: role.id, allow: ['ViewChannel'] }
        ]
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🚫 Has sido BLACKLISTEADO')
      .setDescription(`╔══════════════╗\n` +
                      `                              \n` +
                      `👤 **Usuario:** <@${user.id}>\n` +
                      `🆔 **ID:** \`${user.id}\`\n` +
                      `📄 **Motivo:** ${reason}\n` +
                      `🔧 **Staff:** ${interaction.member.displayName}\n` +
                      `                              \n` +
                      `╚══════════════╝`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setImage('https://wallpapersok.com/images/thumbnail/the-blacklist-loading-screen-bwegxsizsbsvx368.jpg')
      .setFooter({ text: 'Serás expulsado automáticamente en 5 minutos' })
      .setTimestamp();

    await ch.send({ content: `${member}`, embeds: [embed] });

    await interaction.reply({
      content: `✅ <@${user.id}> fue **blacklisteado** correctamente. Se le aplicó el rol y será expulsado en 5 minutos.`,
      ephemeral: true
    });

    setTimeout(async () => {
      const stillBlacklisted = await Blacklist.findOne({ userId: user.id });
      const stillMember = await guild.members.fetch(user.id).catch(() => null);
      if (stillBlacklisted && stillMember) {
        await stillMember.kick('Blacklisteado (expulsión automática)').catch(() => {});
      }
    }, 5 * 60 * 1000);
  }
};
