const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const axios = require('axios');
const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');

import('chalk').then(chalk => {
    process.on('uncaughtException', function (exception) {
        console.log(exception);
    });

    // THIS BASICALLY JUST MAKES A REPLICA OF THE API SO YOU CAN USE IT WITHOUT ANY RATE-LIMITING
    // LOCATED AT http://localhost:3000/
    
    app.get('/api/:item', async (req, res) => {
        try {
            console.log(`[${chalk.default.gray("PENDING")}] autobuy requested item : ${req.params.item}`);

            const proxy_server = proxies[~~(Math.random() * proxies.length)];
            const [ip, port] = proxy_server.split(':');

            const response = await axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${req.params.item}`, {
                proxy: { host: ip, port: parseInt(port, 10) }
            });

            console.log(`[${chalk.default.blue("SUCCESS")}] autobuy sent item : ${req.params.item} (${response.data.length} offers)`);
            res.json(response.data);
        } catch (err) {
            console.log(`[${chalk.default.red("FAILURE")}] autobuy failed on : ${req.params.item}`);
            res.status(500).json({ error: "Failed to fetch item" });
        }
    });

    const dropItem = () => {
        const body = JSON.stringify({
            uniqueID: "12805",
            itemHash: "1740170789-339844",
            quantity: 1
        });
    
        fetch("https://nf-inventory/DROP_ITEM_ON_GROUND", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\""
            },
            referrer: "",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: body,
            method: "POST",
            mode: "cors",
            credentials: "omit"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Item dropped successfully:", data);
        })
        .catch(error => {
            console.error("Error dropping item:", error);
        });
    };
    
    // Exécuter la fonction à intervalles réguliers
    const dropInterval = setInterval(dropItem, 2000); // Par exemple, toutes les 2 secondes
    console.log("Drop item interval ID =", dropInterval);

    app.listen(port, () => {
        console.log(`[+] autobuy server is up and running`);
    });
});
