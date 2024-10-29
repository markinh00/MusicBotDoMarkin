const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const audioQueue = require('../music/audioQueue');
const fetchAudio = require('../utils/fetchAudio');
const validateYouTubeURL = require('../utils/validateYouTubeURL');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from a YouTube URL')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL of the song')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const videoId = validateYouTubeURL(url);
        const downloadsDir = path.join(__dirname, '../downloads');

        if (!videoId) {
            return interaction.reply({ content: 'Please provide a valid YouTube URL.', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const track = await fetchAudio(videoId, connection);

        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        if (!audioQueue.current) {
            audioQueue.current = track;
            interaction.reply({ content: `Playing: ${track.title}` });
            track.audioPlayer.play(track.audioResource);
            connection.subscribe(track.audioPlayer);
        } else {
            audioQueue.add(track);
            interaction.reply({ content: `Added to queue: ${track.title}` });
        }

        track.audioPlayer.once(AudioPlayerStatus.Playing, () => {
            console.log(`Playing: ${track.title}` );
        });

        track.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            if (track.audioResource.playStream && typeof track.audioResource.playStream.destroy === 'function') {
                track.audioResource.playStream.destroy();
            }

            if (audioQueue.queue.length > 0) {
                const nextTrack = audioQueue.next();
                console.log(nextTrack);
                nextTrack.audioPlayer.play(nextTrack.audioResource);
                connection.subscribe(nextTrack.audioPlayer);
            } else {
                audioQueue.clear();
                console.log("No more songs to play")
            }

            setTimeout(() => {
                fs.unlink(track.filePath, (err) => {
                    if (err) console.error(`Failed to delete file: ${track.filePath}`, err);
                });
            }, 500);
        });
    }
};
