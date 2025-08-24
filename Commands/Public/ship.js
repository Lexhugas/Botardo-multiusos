const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('💘 Calcula el amor entre dos personas')
    .addUserOption(option =>
      option.setName('usuario1')
        .setDescription('Primer usuario 💁')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('usuario2')
        .setDescription('Segundo usuario 💁‍♂️')
        .setRequired(true)),

  async execute(interaction) {
    const user1 = interaction.options.getUser('usuario1');
    const user2 = interaction.options.getUser('usuario2');

    if (user1.id === user2.id) {
      return interaction.reply({
        content: '❌ ¡No puedes shippearte contigo mismo! (bueno... a veces sí, pero no hoy 😂)',
        ephemeral: true
      });
    }

    const love = Math.floor(Math.random() * 101); // 0 - 100%

    let mensaje = '';
    if (love >= 90) {
      mensaje = '💍 ¡Almas gemelas! ¡Vayan planeando la boda!';
    } else if (love >= 70) {
      mensaje = '💖 Tienen una conexión poderosa. ¡Love is in the air!';
    } else if (love >= 50) {
      mensaje = '😊 Hay potencial, pero necesitan una buena cita primero.';
    } else if (love >= 30) {
      mensaje = '😅 Uff... tal vez como amigos... o conocidos... 🤝';
    } else {
      mensaje = '🚫 ¡Huye! Ni los astros quieren que esto pase.';
    }

    const barSize = 10;
    const hearts = '💖'.repeat(Math.floor((love / 100) * barSize));
    const empty = '💔'.repeat(barSize - Math.floor((love / 100) * barSize));

    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('💘 SHIPPEO DETECTADO')
      .setThumbnail('') 
      .setDescription(`
✨ **${user1.username}** 💞 **${user2.username}**
> ${hearts}${empty}
> **Compatibilidad:** \`${love}%\`
      
**${mensaje}**
      `)
      .setFooter({ text: '💌 Shipómetro oficial del amor' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
