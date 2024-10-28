const { SlashCommandBuilder } = require('discord.js');
const audioQueue = require('../music/audioQueue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
    async execute(interaction) {
        if (audioQueue.current && audioQueue.current.audioPlayer) {
            audioQueue.current.audioPlayer.pause();
            interaction.reply({ content: 'Paused the current song.' });
        } else {
            interaction.reply({ content: 'No song is currently playing.', ephemeral: true });
        }
    }
};
