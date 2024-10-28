const { SlashCommandBuilder } = require('discord.js');
const audioQueue = require('../music/audioQueue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the paused song'),
    async execute(interaction) {
        if (audioQueue.current && audioQueue.current.audioPlayer) {
            audioQueue.current.audioPlayer.unpause();
            interaction.reply({ content: 'Resumed the current song.' });
        } else {
            interaction.reply({ content: 'No song is paused.', ephemeral: true });
        }
    }
};
