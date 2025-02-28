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

