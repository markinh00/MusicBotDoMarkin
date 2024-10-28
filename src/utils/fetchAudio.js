const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

async function fetchAudio(videoId) {
    const url = `http://localhost:8000/${videoId}`;

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': '*/*',
                'X_API_Key': process.env.API_KEY,
            },
            responseType: 'stream',
        });

        if (response.status !== 200) throw new Error("Error while fetching audio.");

        const disposition = response.headers['content-disposition'];
        let fileName = `${videoId}.mp3`;

        if (disposition) {
            const matches = /filename="([^"]+)"/.exec(disposition);
            if (matches && matches[1]) {
                fileName = matches[1];
            }
        }

        const filePath = path.join(tempDir, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(error);
        throw new Error("Error during audio download.");
    }
}

module.exports = fetchAudio;
