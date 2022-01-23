const player = require("../client/player");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const getLyrics = (title) =>
    new Promise(async (ful, rej) => {
        const url = new URL("https://some-random-api.ml/lyrics");
        url.searchParams.append("title", title);

        try {
            const { data } = await axios.get(url.href);
            ful(data);
        } catch (error) {
            rej(error);
        }
    });

const substring = (length, value) => {
    const replaced = value.replace(/\n/g, "--");
    const regex = `.{1,${length}}`;
    const lines = replaced
        .match(new RegExp(regex, "g"))
        .map((line) => line.replace(/--/g, "\n"));

    return lines;
};

const createResponse = async (title) => {
    try {
        const data = await getLyrics(title);

        const embeds = substring(4096, data.lyrics).map((value, index) => {
            const isFirst = index === 0;

            return new MessageEmbed({
                title: isFirst ? `${data.title} - ${data.author}` : null,
                thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
                description: value
            });
        });

        return { embeds };
    } catch (error) {
        return "Bu şarkının sözlerini bulamıyorum :(";
    }
};

module.exports = {
    name: "şarkı-sözleri",
    description: "belirtilen şarkının sözlerini gösterir",
    options: [
        {
            name: "şarkı-adı",
            description: "sözleri gösterilicek şarının adı",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const title = interaction.options.getString("şarkı-adı");
        const sendLyrics = (songTitle) => {
            return createResponse(songTitle)
                .then((res) => {
                    interaction.reply(res);
                })
                .catch((err) => {interaction.reply("Hata oluştu");});
        };

        if (title) return sendLyrics(title);

        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.reply({
                content: "Şu anda hiçbir müzik çalınmıyor"
            });

        return sendLyrics(queue.current.title);
    }
};
