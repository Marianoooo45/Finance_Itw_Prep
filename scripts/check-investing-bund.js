
const https = require('https');

const url = "https://fr.investing.com/rates-bonds/germany-10-year-bond-yield";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        const match = data.match(/data-test="instrument-price-last"[^>]*>([0-9,]+)/);
        if (match) {
            console.log("Found Price:", match[1]);
        } else {
            console.log("Not found.");
        }
    });
});
