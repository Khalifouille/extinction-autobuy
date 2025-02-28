const corsAnywhere = require('cors-anywhere');

const host = 'localhost'; 
const port = 3000;

corsAnywhere.createServer({
    originWhitelist: [],
    requireHeaders: [],
}).listen(port, host, () => {
    console.log(`CORS proxy is running at http://${host}:${port}`);
});
