
const https = require('https');

// Investing.com often redirects or blocks.
const url = "https://fr.investing.com/rates-bonds/eur-10-years-irs-interest-rate-swap-historical-data";

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        // Investing.com current layout (Dec 2024/2026?): 
        // Use loose regex for "text-5xl" or "instrument-price"
        // The value is likely around 2.XX

        // Debug: Dump a small part if not found
        const match = data.match(/class="[^"]*text-5xl[^"]*">([0-9,]+)/);
        if (match) {
            console.log("Found Price (Method 1):", match[1]);
        } else {
            // Fallback for older layout or mobile view
            const match2 = data.match(/data-test="instrument-price-last"[^>]*>([0-9,]+)/);
            if (match2) {
                console.log("Found Price (Method 2):", match2[1]);
            } else {
                console.log("Not found.");
                console.log("Sample:", data.substring(0, 500));
            }
        }
    });
});
