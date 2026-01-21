
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
        console.log("Status:", res.statusCode);
        // TradingEconomics usually puts the value in a table or specific ID
        // Look for something like <div id="ctl00_ContentPlaceHolder1_ctl00_ctl01_Panel1">...</div>
        // or simply search for "Taux d'inflation" and nearby numbers.
        // A common pattern on TE is inside specific table cells.

        // Debug: Dump some content
        // console.log(data.substring(0, 2000));

        // Try to find the main value (usually large font or in table "Latest")
        // <td id="p" ...>1.9</td> ?

        // Regex for the latest value text often appears as:
        // "Taux d'inflation - Valeurs actuelles, données historiques..."
        // Then looking for digits.

        // Simple heuristic: Look for the number followed by "%" in a likely container.
        // But safer: Check if we got 403 (blocked).
        if (res.statusCode === 403 || data.includes("captcha")) {
            console.log("Blocked by Cloudflare/Protection.");
        } else {
            // Look for specific TE ID for value
            // Reference: TE uses #ctl00_ContentPlaceHolder1_ctl00_ctl01_Panel1 typically for charts, 
            // but there is often a table.
            console.log("Page fetched. Length:", data.length);
        }
    });
});
