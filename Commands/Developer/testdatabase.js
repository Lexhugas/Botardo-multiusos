const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

const testing = require("../../Schemas/test")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("testdatabase")
    .setDescription("asd"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
      
      testing.findOne({ GuildID: interaction.guild.id }).then((data) => {
          if(!data) {
              testing.create({
                  GuildID: interaction.guild.id,
                  UserID: interaction.user.id
              })
          } else {
              console.log(data);
          }
      }) 

    },
};