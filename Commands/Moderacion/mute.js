const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutea a un usuario del servidor.")
    .addUserOption((option) => option.setName(`target`).setDescription(`Usuario a mutear`).setRequired(true))
    .addIntegerOption((option) => option.setName(`tiempo`).setDescription(`Tiempo del muteo en Minutos`).setRequired(true))
    .addStringOption((option) => option.setName(`motivo`).setDescription(`Motivo del muteo.`).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembersMembers),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const user = interaction.options.getUser(`target`);
        const tiempo = interaction.options.getInteger(`tiempo`)
        const { guild } = interaction;

        let motivo = interaction.options.getString(`motivo`);
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

    if (!motivo) motivo = "❌No se añadió razon";
    if(user.id === interaction.user.id) return interaction.reply({content: `**❌ERROR❌** No puedes mutearte a ti mismo ⚠️`, ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({content: `**❌ERROR❌** No puedes mutearme a mi ⚠️`, ephemeral: true});
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: `**❌ERROR❌** No puedes mutear a alguien con un rol igual o superior al tuyo ⚠️`, ephemeral: true});
    if(!member.kickable) return interaction.reply({content: `**❌ERROR❌** No puedo mutear a alguien con un rol superior al mío ⚠️`, ephemeral: true});
    if (tiempo > 10000) return interaction.reply({content: `**❌ERROR❌** El tiempo no puede sobrepasar los 10.000 minutos ⚠️`, ephemeral: true})

    const embed = new EmbedBuilder()
    .setTitle(`🔇Usuario Muteado🔇`)
    .setDescription(`El usuario **${user.tag}** ha sido muteado correctamente`)
    .setColor(`#ff0000`)
    .setTimestamp()
    .setThumbnail(`${user.displayAvatarURL({dynamic: true})}`)
    .addFields({ name: `**👤Usuario Muteado**`, value: `${user.tag}`, inline: true}, { name: `**📝Motivo**`, value: `${motivo}`, inline: true}, { name: `**🛡️Moderador responsable**`, value: `${interaction.user}`}, { name: `**📆Fecha**`, value: `${new Date().toLocaleString('es-ES')}`,}, { name: `**⏰Tiempo**`, value: `${tiempo}`});

    await member.timeout(tiempo * 60 * 1000, motivo).catch(console.error);

    interaction.reply({embeds: [embed]});
    },
}