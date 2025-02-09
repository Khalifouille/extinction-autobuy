const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const axios = require('axios');
const cors = require('cors');
import('chalk').then(chalk => {
    app.use(cors());

    process.on('uncaughtException', function (exception) {
        console.log(exception);
    });

    // THIS BASICALLY JUST MAKES A REPLICA OF THE API SO YOU CAN USE IT WITHOUT ANY RATE-LIMITING
    // LOCATED AT http://localhost:3000/
    
    app.get('/api/:item', async (req, res) => {
        try {
            console.log(`[${chalk.default.gray("PENDING")}] autobuy requested item : ${req.params.item}`);

            const response = await axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${req.params.item}`);

            if (!response.data || typeof response.data !== 'object') {
                throw new Error("Invalid JSON response from API");
            }

            console.log(`[${chalk.default.blue("SUCCESS")}] autobuy sent item : ${req.params.item} (${response.data.length} offers)`);
            res.json(response.data);
        } catch (err) {
            console.log(`[${chalk.default.red("FAILURE")}] autobuy failed on : ${req.params.item}, Error: ${err.message}`);
            console.log(err.response ? err.response.data : 'No response data');
            res.status(500).json({ error: "Failed to fetch item", details: err.message });
        }
    });

    app.listen(port, () => {
        console.log(`[+] autobuy server is up and running`);
    });
});
