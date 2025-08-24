const mongoose = require('mongoose');

const marriageSchema = new mongoose.Schema({
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Marriage', marriageSchema);
