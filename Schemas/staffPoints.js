const mongoose = require('mongoose');

const staffPointsSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  points: { type: Number, default: 0 }
});

module.exports = mongoose.model('StaffPoints', staffPointsSchema);
