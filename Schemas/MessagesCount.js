// Ejemplo simple esquema (MessagesCount.js)
const mongoose = require('mongoose');

const mensajesSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  username: String, 
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('MessagesCount', mensajesSchema);
