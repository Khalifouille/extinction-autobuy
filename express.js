import express from 'express';
import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';

const app = express();
const port = 3000;
const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');

process.on('uncaughtException', function (exception) {
    console.log(exception);
});

// THIS BASICALLY JUST MAKES A REPLICA OF THE API SO YOU CAN USE IT WITHOUT ANY RATE-LIMITING
// LOCATED AT http://localhost:3000/

app.get('/api/:item', async (req, res) => {
    try {
        console.log(`[${chalk.gray("PENDING")}] autobuy requested item : ${req.params.item}`);
        const proxy_server = proxies[~~(Math.random() * proxies.length)];
        const [ip, port] = proxy_server.split(':');
        const response = await axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${req.params.item}`, {
            proxy: {
                host: ip,
                port: port,
            }
        });
        console.log(`[${chalk.blue("SUCCESS")}] autobuy sent item : ${req.params.item} (${response.data.length} offers)`);
        res.json(response.data);
    } catch (err) {
        console.log(`[${chalk.red("FAILURE")}] autobuy failed on : ${req.params.item}`);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`[+] autobuy server is up and running`);
});