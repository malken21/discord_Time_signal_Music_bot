const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, 'GUILD_VOICE_STATES'] });
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } = require('@discordjs/voice');
const cron = require('node-cron');

const Config = require("./Config.json");

client.login(Config.TOKEN);

let ready = false

client.on('ready', () => {
  ready = true
  console.log(`login!!(${client.user.tag})`);
});

cron.schedule(Config.time, async () => {
  if (ready) {
    console.log("play!!")
    const player = createAudioPlayer();
    const channel = client.guilds.cache.get(Config.ServerID).channels.cache.get(Config.ChannelID);
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: false
    });
    connection.subscribe(player);
    const resource = createAudioResource(Config.mp3);
    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    connection.destroy();
  }
})