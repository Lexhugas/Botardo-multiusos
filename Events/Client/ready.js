const { loadCommands } = require("../../Handlers/commandHandler");
const config = require("../../config.json")
const mongoose = require("mongoose")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
      console.log("El cliente se ha iniciado");
      
      await mongoose.connect(config.mongopass, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      if (mongoose.connect) {
        console.log("El bot se ha conectado a la database")
      }
        

      loadCommands(client);
    },
};