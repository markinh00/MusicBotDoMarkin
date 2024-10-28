const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'pause',
    description: 'Pause the music that is playing.',
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (!connection) {
            return interaction.reply("I'm not connected to a voice channel.");
        }

        const player = connection.state.subscription.player;

        if (player && player.state.status === 'playing') {
            player.pause();
            return interaction.reply("Mucis paused.");
        } else {
            return interaction.reply("No music is being played for me to pause.");
        }
    },
};
