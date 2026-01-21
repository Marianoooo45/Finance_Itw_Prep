
const https = require('https');

const url = "https://query1.finance.yahoo.com/v8/finance/chart/^FCHI?interval=1d&range=1d";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log("Success:", data.substring(0, 100)));
}).on('error', (e) => console.error("Error:", e.message));
