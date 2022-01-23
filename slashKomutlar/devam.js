const player = require("../client/player");

module.exports = {
    name: "devam",
    description: "şarkıyı devam ettirir",
    options:[],
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        if(queue.setPaused == false){
            interaction.reply({content:"Oynatılan şarkı yok"})
        }
        else{
            queue.setPaused(false);
        }
        

        return interaction.reply({ content: "Şarkı devam ediyor!" });
    },
};
