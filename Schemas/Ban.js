const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  banId: String,
  userId: String,
  userTag: String,
  staffId: String,
  staffName: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  duration: Number // ms
});

module.exports = mongoose.model('Ban', banSchema);
