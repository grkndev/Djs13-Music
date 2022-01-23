const player = require("../client/player");

module.exports = {
    name: "bitir",
    description: "oynatılan şarkıyı bitirir",options:[],
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.stop();

        return interaction.reply({ content: "Müzik bitti!" });
    },
};
