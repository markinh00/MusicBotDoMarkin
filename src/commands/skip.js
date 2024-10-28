const { SlashCommandBuilder } = require('discord.js');
const audioQueue = require('../music/audioQueue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    async execute(interaction) {
        if (audioQueue.current && audioQueue.current.audioPlayer) {
            audioQueue.current.audioPlayer.stop();
            
            if (audioQueue.queue.length > 0) {
                interaction.reply({ content: `Playing the next song` });
            } else {
                interaction.reply({ content: 'No more songs in the queue.' });
            }
        } else {
            interaction.reply({ content: 'No song is currently playing.', ephemeral: true });
        }
    }
};
