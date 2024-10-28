const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'skip',
    description: 'Skip to the next music.',
    
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (!connection) {
            return interaction.reply("I'm not connected to a voice channel.");
        }
        
        const player = connection.state.subscription.player;
        
        if (!player) return interaction.reply("No music is being played for me to pause.");
        
        player.stop();
        return await interaction.reply("Music skipped.");        
    },
};