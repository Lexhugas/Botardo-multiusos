const StaffPoints = require('./Schemas/staffPoints'); 

async function addPoints(guildId, userId, amount) {
  if (!amount || amount <= 0) return;
  await StaffPoints.findOneAndUpdate(
    { guildId, userId },
    { $inc: { points: amount } },
    { upsert: true, new: true }
  );
}

module.exports = { addPoints };
