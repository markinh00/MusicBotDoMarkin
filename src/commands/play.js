const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const validateYouTubeURL = require('../utils/validateYouTubeURL');
const fetchAudio = require('../utils/fetchAudio');
const fs = require('fs');

module.exports = {
    name: 'play',
    description: 'Add a music to playlist.',
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const videoId = validateYouTubeURL(url);
        
        if (!videoId) {
            await interaction.reply("Invalid URL. Please, provide a Youtube link.");
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply("You need to be in a voice channel to play music!");
            return;
        }

        try {
            const filePath = await fetchAudio(videoId);
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(filePath);

            player.play(resource);
            connection.subscribe(player);

            player.on('idle', () => {
                fs.unlink(filePath, (err) => { if (err) console.error(err); });
                connection.destroy();
            });

            await interaction.reply("Playing now!");
        } catch (error) {
            console.error(error);
            await interaction.reply("Erro while playing music.");
        }
    }
};
