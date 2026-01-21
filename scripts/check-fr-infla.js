
const https = require('https');

const url = "https://france-inflation.com/";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);

        // Strategy: Look for the big number prominently displayed.
        // It's often in a specific div or table cell.
        // "dernier indice" or "taux"

        // Just dump the first few matches for a digit followed by %
        // Or look for "Inflation France" text context.

        // Looking for <div id="taux_inflation" ...> or similar?
        // Let's print snippets around "Inflation France"

        const idx = data.indexOf("Taux d'inflation");
        if (idx !== -1) {
            console.log("Found 'Taux d'inflation'. Context:");
            console.log(data.substring(idx, idx + 300));
        }

        // Try regex for x.x% or x,x%
        const regex = /([0-9]+,[0-9]+)%/g;
        let match;
        let count = 0;
        console.log("Possible percentage matches:");
        while ((match = regex.exec(data)) !== null && count < 5) {
            console.log(match[0]);
            count++;
        }
    });
});
