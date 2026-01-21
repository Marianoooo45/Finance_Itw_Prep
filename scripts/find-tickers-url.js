
const https = require('https');

function search(query) {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(`\nResults for "${query}":`);
                json.quotes.forEach(q => console.log(`  ${q.symbol} (${q.shortname}) - ${q.quoteType}`));
            } catch (e) { console.error(e.message); }
        });
    });
}

search('Fed Funds');
search('Euribor');
search('2 Year Treasury');
search('Swap Rate');
