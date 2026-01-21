
const https = require('https');

const queries = [
    'ZQ=F', // Fed Funds Futures
    'ZT=F', // 2Y Note Futures
    'ZN=F', // 10Y Note Futures
    'KE=F', // 3M Euribor Futures? (ICE)
    'FEI=F', // Euribor?
    '^IRX',
    '^FVX'
];

function check(q) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${q}?interval=1d&range=1d`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla' } }, (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => {
            try {
                const j = JSON.parse(d);
                const meta = j.chart.result[0].meta;
                console.log(`${q}: ${meta.regularMarketPrice} (${meta.currency}) - ${meta.symbol}`);
            } catch (e) { console.log(`${q}: Failed`); }
        });
    });
}

queries.forEach(check);
