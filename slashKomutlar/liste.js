const player = require("../client/player");

module.exports = {
    name: "liste",
    description: "şarkı sırasını göster",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "Şu anda hiçbir şarkı çalmıyor",
            });

        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. [**${m.title}**](${m.url}) - ${
                m.requestedBy.tag
            }`;
        });

        return interaction.followUp({
            embeds: [
                {
                    title: "Şarkı kuyruğu",
                    description: `${tracks.join("\n")}${
                        queue.tracks.length > tracks.length
                            ? `\n...${
                                  queue.tracks.length - tracks.length === 1
                                      ? `${
                                            queue.tracks.length - tracks.length
                                        } daha fazla...`
                                      : `${
                                            queue.tracks.length - tracks.length
                                        } daha fazla...`
                              }`
                            : ""
                    }`,
                    color: "RANDOM",
                    fields: [
                        {
                            name: "Şuanda oynatılan",
                            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
                        },
                    ],
                },
            ],
        });
    },
};
