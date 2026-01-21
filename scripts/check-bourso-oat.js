
const https = require('https');

const url = "https://www.boursorama.com/bourse/taux/cours/2xFRABM10A/";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        // Boursorama typically has <span class="c-instrument c-instrument--last" ...>2,845</span>
        const match = data.match(/class="c-instrument c-instrument--last"[^>]*>([0-9,]+)/);
        if (match) {
            console.log("Found Price:", match[1]);
        } else {
            console.log("Price not found.");
            // console.log(data.substring(0, 2000));
        }
    });
});
