const { QueryType } = require("discord-player");
const player = require("../client/player");

module.exports = {
    name: "oynat",
    description: "şarkı oynatır",
    options: [
        {
            name: "şarkıadı",
            description: "müziğin adı",
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const songTitle = interaction.options.getString("şarkıadı");

        if (!interaction.member.voice.channel)
            return interaction.reply({
                content: "Lütfen önce bir sesli kanala katılın!",
            });

        const searchResult = await player.search(songTitle, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        const queue = await player.createQueue(interaction.guild, {
            metadata: interaction.channel,
        });

        if (!queue.connection)
            await queue.connect(interaction.member.voice.channel);

        interaction.reply({ content: `Oynatılıyor **${songTitle}**` });

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play();
    },
};
