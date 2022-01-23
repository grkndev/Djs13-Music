const player = require("../client/player");

module.exports = {
    name: "oynatılıyor",
    description: "oynatılan parçanın bilgilerini gösterir",
    options:[],
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.reply({
                content: "şuanda müzik çalınmıyor",
            });

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.reply({
            embeds: [
                {
                    title: "Şimdi çalıyor",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress,
                        },
                    ],
                    color: "BLUE",
                    footer: {
                        text: `Kuyuruğa ekleyen ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};
