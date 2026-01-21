
const https = require('https');

const url = "https://fr.tradingeconomics.com/france/inflation-cpi";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Look for the "Latest" value. 
        // Typically in a table row with "Taux d'inflation"
        // <tr ...> <td>Taux d'inflation</td> <td>2.9</td> ... </tr>

        // Remove newlines for regex safety
        const clean = data.replace(/\s+/g, ' ');

        // Search for "Taux d'inflation" followed by a number
        const match = clean.match(/Taux d'inflation\s*<\/a>\s*<\/td>\s*<td[^>]*>([0-9\.,]+)/);

        if (match) {
            console.log("Found:", match[1]);
        } else {
            console.log("Not found via table.");
            // Try title or specific div
            // <div id="ctl00_ContentPlaceHolder1_ctl00_ctl01_Panel1">...</div>
        }
    });
});
