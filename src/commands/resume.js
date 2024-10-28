const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'resume',
    description: 'Continua a música pausada.',
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (!connection) {
            return interaction.reply("I'm not connected to a voice channel.");
        }

        const player = connection.state.subscription.player;

        if (player && player.state.status === 'paused') {
            player.unpause();
            return interaction.reply("Playing music again.");
        } else {
            return interaction.reply("No music is paused at the moment.");
        }
    },
};
