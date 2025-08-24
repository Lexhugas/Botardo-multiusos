const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
  moderador: String,          
  usuarioAdvertido: String,   
  motivo: String,
  fecha: String,
  apelable: String,
  warnID: Number,
});

const Warn = mongoose.model("Warn", warnSchema);

module.exports = Warn;
