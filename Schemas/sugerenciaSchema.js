const mongoose = require('mongoose');

const sugerenciaSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  suggestion: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  state: { type: String, enum: ['pendiente', 'aceptada', 'rechazada'], default: 'pendiente' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sugerencia', sugerenciaSchema);
