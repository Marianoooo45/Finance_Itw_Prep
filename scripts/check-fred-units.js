
const https = require('https');

// Test if adding units=pc1 to the HTML URL changes the displayed value in the HTML
const seriesId = "CPHPTT01EZM661N";
const url = `https://fred.stlouisfed.org/series/${seriesId}?units=pc1`;

https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Look for the value
        const match = data.match(/<span class="series-meta-observation-value">([0-9\.]+)<\/span>/);
        if (match) {
            console.log(`Value with units=pc1: ${match[1]}`);
        } else {
            console.log("Value not found in HTML.");
        }
    });
});

const url2 = `https://fred.stlouisfed.org/series/${seriesId}`;
https.get(url2, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Look for the value
        const match = data.match(/<span class="series-meta-observation-value">([0-9\.]+)<\/span>/);
        if (match) {
            console.log(`Value default: ${match[1]}`);
        } else {
            console.log("Value not found in HTML.");
        }
    });
});
