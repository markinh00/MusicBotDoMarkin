const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
require('dotenv').config();
const generateRandomName = require('./generateRandomName');

module.exports = async function fetchAudio(videoID) {
    const audioFileName = generateRandomName() + '.mp3';
    const downloadsDir = path.join(__dirname, '../downloads');
    const filePath = path.resolve(downloadsDir, audioFileName);
    const url = `http://localhost:8000/${videoID}/base64`;

    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
    }

    const response = await fetch(url, {
        headers: { 'X-API-Key': process.env.API_KEY }
    });

    if (!response.ok) throw new Error('Failed to fetch audio');

    const data = await response.json();

    const base64String = data.file.replace(/b'|'/g, '');
    const mp3Data = Buffer.from(base64String, 'base64');
    fs.writeFileSync(filePath, mp3Data);

    const audioResource = createAudioResource(filePath);
    const audioPlayer = createAudioPlayer();

    return { title: data.title, audioPlayer, audioResource, filePath };
};
