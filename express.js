const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

process.on('uncaughtException', function (exception) {
    console.log("Uncaught Exception:", exception);
});

// Proxy vers https://lb-picchat/PicChat
app.post('/PicChat', async (req, res) => {
    try {
        console.log(`[PENDING] PicChat request received:`, req.body);

        const response = await axios.post('https://lb-picchat/PicChat', req.body, {
            headers: {
                'sec-ch-ua': '"Chromium";v="103"',
                'Referer': 'https://cfx-nui-lb-picchat/',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.141 CitizenFX/1.0.0.12600 Safari/537.36',
                'sec-ch-ua-platform': '"Windows"',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        // Log la réponse de l'API cible
        console.log(`[SUCCESS] API response:`, response.data);

        res.json(response.data);
    } catch (err) {
        console.error(`[FAILURE] PicChat request failed:`, err.message);
        res.status(err.response?.status || 500).json({ error: "Request failed", details: err.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`[+] Proxy server running on http://localhost:${port}/PicChat`);
});
