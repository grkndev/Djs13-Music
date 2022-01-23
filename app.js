const fs = require("fs");
const {Client, Intents, Collection} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const client = new Client({
  fetchAllMembers: true,
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ]});
const {token} = require("./ayarlar.json");

const {Player} = require("discord-player");
global.client = client;
client.commands = (global.commands = []);
fs.readdir("./slashKomutlar/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./slashKomutlar/${file}`);

        client.commands.push({
             name: props.name.toLowerCase(),
             description: props.description,
             options: props.options,
            // type:'CHAT_INPUT',
        })
        console.log(`👌 Komut Yüklendi: ${props.name}`);
    });
});

fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        
        console.log(`👌 Event yüklendi: ${eventName}`);
        client.on(eventName, (...args) => {
           event(client, ...args);
        });
    });
});

client.on("ready", async () => {
  
    const rest = new REST({ version: "9" }).setToken(token);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }
});
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
client.login(token);