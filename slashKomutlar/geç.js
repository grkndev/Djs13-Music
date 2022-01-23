const player = require("../client/player");

module.exports = {
    name: "atla",
    description: "oynatılan şarkıyı atlar",
    options:[],
    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.reply({
                content: "Oynatılan parça yok",
            });

        await queue.skip();

        interaction.reply({ content: "Şarkı atlandı!" });
    },
};
