
const https = require('https');

const url = "https://fr.tradingeconomics.com/france/inflation-cpi";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
        // Just dump the first 5000 chars or look for "Taux d'inflation"
        const idx = data.indexOf("Taux d'inflation");
        if (idx > -1) {
            console.log("Snippet:");
            console.log(data.substring(idx, idx + 400));
        } else {
            console.log("String Taux d'inflation not found");
        }
    });
});
