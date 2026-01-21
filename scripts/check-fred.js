
const https = require('https');

const url = "https://fred.stlouisfed.org/series/FEDFUNDS";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // FRED Value usually in <span class="series-meta-observation-value">5.33</span>
        const match = data.match(/<span class="series-meta-observation-value">([0-9\.]+)<\/span>/);
        if (match) {
            console.log("Found:", match[1]);
        } else {
            console.log("Not found. Dumping some HTML:");
            console.log(data.substring(0, 1000));
            // Also check for meta tags
            // <meta property="og:description" content="... 5.33 Percent ..." />
        }
    });
});
