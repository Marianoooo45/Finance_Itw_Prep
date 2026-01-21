
const https = require('https');
const queries = ['GBL=F', '^TNX', '^FVX', 'ZR=F'];

function check(q) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${q}?interval=1d&range=1d`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla' } }, r => {
        let d = ''; r.on('data', c => d += c);
        r.on('end', () => {
            try {
                const res = JSON.parse(d).chart.result[0].meta;
                console.log(`${q}: ${res.regularMarketPrice}`);
            } catch (e) { console.log(`${q}: Error`); }
        });
    });
}
queries.forEach(check);
