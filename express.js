const express = require('express')
const app = express()
const fs = require('fs');
const port = 3000
const axios = require('axios');
const proxies = fs.readFileSync('proxies.txt','utf-8').replace(/\r/gi, '').split('\n');
const chalk = require('chalk');

    process.on('uncaughtException', function (exception) {
        console.log(exception);
    });

    app.post('/create-offer', async (req, res) => {
        console.log("Request Body:", req.body); 

        const { itemId, itemName, quantity, price, corsProxy } = req.body;

        if (!itemId || !itemName || !quantity || !price || !corsProxy) {
            return res.status(400).json({ error: 'Données manquantes dans la requête.' });
        }

        const offerData = {
            "type": "createOffer",
            "data": {
                "offer": {
                    "itemId": "kevlar",        
                    "itemName": "Kevlar",     
                    "quantity": 8,             
                    "price": 3887             
                },
                "sell": true                  
            }
        };

        try {
            const response = await axios.post('http://localhost:8080/https://gtalife/gameMenuAuctionEvent', offerData, {
                headers: {
                    'sec-ch-ua': '"Chromium";v="103"',
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': '',
                    'Content-Type': 'application/json',
                    'sec-ch-ua-mobile': '?0',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.141 CitizenFX/1.0.0.12600 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"'
                }
            });

            if (response.data && response.data.success) {
                res.json({
                    success: true,
                    message: 'Offre créée avec succès.',
                    data: response.data
                });
            } else {
                res.status(500).json({
                    error: 'Échec de la création de l\'offre.',
                    details: response.data || 'Aucune réponse valide de l\'API.'
                });
            }
        } catch (err) {
            console.error(`[${chalk.default.red("ERROR")}] Failed to create offer: ${err.message}`);
            res.status(500).json({
                error: 'Erreur lors de la création de l\'offre',
                details: err.message
            });
        }
    });
    });
});

process.on('uncaughtException', function (exception) {
    console.log(exception);
});
// THIS BASICALLY JUST MAKES A REPLICA OF THE API SO YOU CAN USE IT WITHOUT ANY RATE-LIMITING
// LOCATED AT http://localhost:3000/
  
app.get('/api/:item', (req, res) => {
    try {
      console.log(`[${chalk.gray("PENDING")}] autobuy requested item : ${req.params.item}`);
      const proxy_server = proxies[~~(Math.random() * proxies.length)];
      var ip = proxy_server.split(':')[0];
      var port = proxy_server.split(':')[1];
      axios.get(`https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${req.params.item}`, {
        proxy: {
          host: ip,
          port: port,
        }
      })
        .then(function (response) {
          console.log(`[${chalk.blue("SUCESS")}] autobuy sent item : ${req.params.item} (${response.data.length} offers)`);
          const data = response.data;
          res.json(response.data);
        })
      }
      catch (err) {
        return console.log(`[${chalk.red("FAILURE")}] autobuy failed on : ${req.params.item})`);;
      }
})

app.listen(port, () => {
  console.log(`[+] autobuy server is up and running`);
})