const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  userId: String,
  userTag: String,
  staffId: String,
  staffName: String,
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
