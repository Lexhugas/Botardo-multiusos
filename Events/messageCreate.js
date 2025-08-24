const Level = require('../Schemas/levelSchema');
const config = require('../config.json');
const actualizarLevelRoles = require('../utils/actualizarLevelRoles'); 

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const incXP = 50;

    const lvl = await Level.findOneAndUpdate(
      { userId: message.author.id },
      { $inc: { xp: incXP } },
      { upsert: true, new: true }
    );

    console.log(`[XP] ${message.author.tag} tiene ${lvl.xp} XP y está en nivel ${lvl.level}`);

    let leveledUp = false;

    while (lvl.xp >= (1000 + lvl.level * 400)) {
      const reqXP = 1000 + lvl.level * 400;
      lvl.xp -= reqXP;
      lvl.level += 1;
      leveledUp = true;

      console.log(`[XP] ${message.author.tag} ha subido al nivel ${lvl.level}`);
    }

    if (leveledUp) {
      await lvl.save();

      const member = await message.guild.members.fetch(message.author.id).catch(() => null);
      if (member) {
        await actualizarLevelRoles(member, lvl.level); 
      }

      message.channel.send(`🎉 ${message.member}, ¡subiste al nivel ${lvl.level}!`);
    }
  }
};
