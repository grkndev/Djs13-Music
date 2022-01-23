const player = require("../client/player");

module.exports = {
    name: "durdur",
    description: "oynatılan şarkıyı durdurur",options:[],
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.setPaused(true);

        return interaction.reply({ content: "Parça durduruldu!" });
    },
};
