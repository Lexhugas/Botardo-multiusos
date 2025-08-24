const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 }
});

module.exports = mongoose.model('Level', LevelSchema);
