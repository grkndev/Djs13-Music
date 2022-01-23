const { Player } = require("discord-player");
//const client = require("../index.js");

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Kuyruktan çıkan hata: ${error.message}`);
  });
  player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Bağlantıdan kaynaklanan hata: ${error.message}`);
  });
  player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | Ses kanalıyla bağlantım manuel olarak kesildi, sıra temizlendi!");
  });
  player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Ses kanalında kimse yok, ayrılıyor...");
  });
  
  player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Sıra tamamlandı!");
  });
  
module.exports = player;
