const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickea a un usuario del servidor.")
    .addUserOption((option) => option.setName(`target`).setDescription(`Usuario a kickear`).setRequired(true))
    .addStringOption((option) => option.setName(`motivo`).setDescription(`Motivo del kickeo.`).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const user = interaction.options.getUser(`target`);
        const { guild } = interaction;

        let motivo = interaction.options.getString(`motivo`);
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

    if (!motivo) motivo = "❌No se añadió razon";
    if(user.id === interaction.user.id) return interaction.reply({content: `**❌ERROR❌** No puedes kickearte a ti mismo ⚠️`, ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({content: `**❌ERROR❌** No puedes kickearme a mi ⚠️`, ephemeral: true});
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: `**❌ERROR❌** No puedes kickear a alguien con un rol igual o superior al tuyo ⚠️`, ephemeral: true});
    if(!member.kickable) return interaction.reply({content: `**❌ERROR❌** No puedo kickear a alguien con un rol superior al mío ⚠️`, ephemeral: true});

    const embed = new EmbedBuilder()
    .setTitle(`🦵Usuario Kickeado🦵`)
    .setDescription(`El usuario **${user.tag}** ha sido kickeado correctamente`)
    .setColor(`#ff0000`)
    .setTimestamp()
    .setThumbnail(`${user.displayAvatarURL({dynamic: true})}`)
    .addFields({ name: `**👤Usuario Kickeado**`, value: `${user.tag}`, inline: true}, { name: `**📝Motivo**`, value: `${motivo}`, inline: true}, { name: `**🛡️Moderador responsable**`, value: `${interaction.user}`}, { name: `**📆Fecha**`, value: `${new Date().toLocaleString('es-ES')}`,});

    await member.kick(motivo).catch(console.error);

    interaction.reply({embeds: [embed]});
    },
}